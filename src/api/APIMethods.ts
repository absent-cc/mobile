import Constants from 'expo-constants';
import { AppSettings } from '../state/SettingsContext';
import {
    apiResponseToSchedule,
    DefaultAppSettings,
    joinName,
    numToGrade,
    splitName,
    strToSchool,
} from '../Utils';
import {
    AuthenticationError,
    BadTokenError,
    NetworkError,
    NonNPSError,
    ServerError,
    UnknownError,
} from './APIErrors';
import {
    AbsenceList,
    Block,
    DaySchedule,
    EditingSchedule,
    Schedule,
    SchoolName,
    UserSettings,
    WeekSchedule,
} from './APITypes';

const baseURL = Constants.manifest?.extra?.isDevelopment
    ? 'https://api.absent.cc/v1'
    : 'https://api.absent.cc/v1';

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

const getHeaders = (token: string): Headers => {
    return new Headers({
        ...headers,
        'Absent-Auth': token,
    });
};

const url = (path: string): string => {
    return `${baseURL}${path}`;
};

const getFromAPI = async (
    {
        method,
        path,
        token,
        body,
    }: {
        method: string;
        path: string;
        token?: string;
        body?: object;
    },
    caller: string,
): Promise<any> => {
    // give response a 6s timeout, since fetch doesn't do this automatically
    // const responseTimeout = setTimeout(async () => {
    //     throw new NetworkError(caller, true);
    // }, 0);

    const controller = new AbortController();
    const responseTimeout = setTimeout(() => controller.abort(), 6000);

    let response: Response;
    try {
        response = await fetch(url(path), {
            method,
            headers: token ? getHeaders(token) : headers,
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal,
        });
        clearTimeout(responseTimeout);
    } catch (e: any) {
        // json error
        if (e.name === 'AbortError') {
            throw new NetworkError(caller);
        } else if (e instanceof TypeError) {
            throw new NetworkError(caller);
        } else if (e instanceof Error) {
            throw new UnknownError(caller, e.message);
        } else {
            throw new UnknownError(caller);
        }
    }

    if (response.status >= 500) {
        throw new ServerError(caller, `Status code ${response.status}`);
    }

    let responseText: string;
    try {
        responseText = await response.text();
    } catch (e: any) {
        if (e instanceof Error) {
            throw new UnknownError(caller, e.message);
        } else {
            throw new UnknownError(caller);
        }
    }

    let responseJSON: any;
    try {
        responseJSON = JSON.parse(responseText);
    } catch (e: any) {
        if (e instanceof SyntaxError) {
            throw new UnknownError(
                caller,
                `Error while JSON parsing server response. Response from server was: ${responseText}`,
            );
        } else if (e instanceof Error) {
            throw new UnknownError(caller, e.message);
        } else {
            throw new UnknownError(caller);
        }
    }

    if (!response.ok) {
        if (
            responseJSON.detail ===
            'Authentication Error - Signature has expired'
        ) {
            throw new BadTokenError(caller);
        } else if (responseJSON?.detail === 'Not authenticated') {
            throw new AuthenticationError(caller, 'Not authenticated');
        } else if (
            responseJSON?.detail ===
            'Authentication Error - Not an NPS issued account'
        ) {
            throw new NonNPSError(caller);
        } else if (
            responseJSON?.detail?.startsWith &&
            responseJSON?.detail?.startsWith('Authentication Error')
        ) {
            throw new AuthenticationError(
                caller,
                responseJSON?.detail?.substring(
                    'Authentication Error - '.length,
                ),
            );
        } else {
            const desc = responseJSON.detail
                ? responseJSON.detail
                : responseJSON;

            throw new UnknownError(
                caller,
                `${response.status} ${
                    typeof desc === 'object' ? JSON.stringify(desc) : desc
                }`,
            );
        }
    }

    return responseJSON;
};

export async function fetchAbsences(
    token: string,
    dateStr: string,
    schoolName: SchoolName,
): Promise<AbsenceList> {
    // TODO: make this actually reflect the api
    const response = await getFromAPI(
        {
            method: 'GET',
            path: `/teachers/absences?${new URLSearchParams({
                date: dateStr,
                school: schoolName,
            }).toString()}`,
            token,
        },
        'Fetch Absences',
    );

    return response.absences.map((absence: any) => {
        return {
            time: absence.length,
            note: absence.note,
            teacher: {
                tid: absence.teacher.tid,
                school: absence.teacher.school,
                name: joinName(absence.teacher.first, absence.teacher.last),
            },
        };
    });

    // const responseStr = await fetch(url('/teachers/absences/'), {
    //     method: 'GET',
    //     headers: getHeaders(token),
    // });
    // if (!responseStr.ok) {
    //     throw new Error(
    //         `fetchAbsences failed with error ${
    //             responseStr.status
    //         }: ${await responseStr.text()}`,
    //     );
    // }
    // const response = await responseStr.json();

    // return response;
}

export async function fetchSettings(token: string): Promise<{
    uid: string;
    user: UserSettings;
    schedule: Schedule;
    app: AppSettings;
}> {
    const response = await getFromAPI(
        {
            method: 'GET',
            path: '/users/me/info/',
            token,
        },
        'Fetch Settings',
    );

    // const responseStr = await fetch(url('/users/me/info'), {
    //     method: 'GET',
    //     headers: token ? getHeaders(token) : headers,
    //     body: undefined,
    // });
    // if (!responseStr.ok) {
    //     throw new Error(
    //         `fetchSettings failed with error ${
    //             responseStr.status
    //         }: ${await responseStr.text()}`,
    //     );
    // }
    // const response = await responseStr.json();

    return {
        uid: response.profile.uid,
        user: {
            name: joinName(response.profile.first, response.profile.last),
            school: strToSchool(response.profile.school),
            grade: numToGrade(response.profile.grade),
        },
        schedule: apiResponseToSchedule(response.schedule),
        app: {
            showFreeBlocks:
                response.settings?.showFreeAsAbsent ??
                DefaultAppSettings.showFreeBlocks,
            sendNotifications:
                response.settings?.notify ??
                DefaultAppSettings.sendNotifications,
            sendNoAbsenceNotification:
                response.settings?.notifyWhenNone ??
                DefaultAppSettings.sendNoAbsenceNotification,
        },
    };
}

export async function getClassesToday(
    dateStr: string,
    token: string,
): Promise<Block[]> {
    // const responseStr = await fetch(
    //     url(
    // `/teachers/classes?${new URLSearchParams({
    //     date: dateStr,
    // }).toString()}`,
    //     ),
    //     {
    //         method: 'GET',
    //         headers: getHeaders(token),
    //     },
    // );
    // if (!responseStr.ok) {
    //     throw new Error(
    //         `getClassesToday failed with error ${
    //             responseStr.status
    //         }: ${await responseStr.text()}`,
    //     );
    // }

    // const response = await responseStr.json();

    // return response.classes;
    const response = await getFromAPI(
        {
            method: 'GET',
            path: `/teachers/classes?${new URLSearchParams({
                date: dateStr,
            }).toString()}`,
            token,
        },
        'Fetch Classes Today',
    );

    return response.classes;
}

export async function fetchWeekSchedule(
    dateStr: string,
    school: SchoolName,
    token: string,
): Promise<WeekSchedule> {
    // const responseStr = await fetch(
    //     url(
    // `/teachers/classes?${new URLSearchParams({
    //     date: dateStr,
    // }).toString()}`,
    //     ),
    //     {
    //         method: 'GET',
    //         headers: getHeaders(token),
    //     },
    // );
    // if (!responseStr.ok) {
    //     throw new Error(
    //         `getClassesToday failed with error ${
    //             responseStr.status
    //         }: ${await responseStr.text()}`,
    //     );
    // }

    // const response = await responseStr.json();

    // return response.classes;
    const response = await getFromAPI(
        {
            method: 'GET',
            path: `/info/schedule/week?${new URLSearchParams({
                date: dateStr,
            }).toString()}`,
            token,
        },
        'Fetch Week Schedule',
    );

    const result: WeekSchedule = {};

    const convertSpecialBlocks = (block: string) => {
        if (block === 'EXTRA')
            return school === SchoolName.NSHS ? Block.LION : Block.TIGER;

        return block as Block;
    };

    response.forEach((day: DaySchedule) => {
        result[day.date] = {
            ...day,
            schedule: day.schedule.map((dayBlock) => ({
                ...dayBlock,
                block: convertSpecialBlocks(dayBlock.block),
            })),
        };
    });

    return result;
}

export async function saveSettings(
    newSettings: {
        user: UserSettings;
        schedule: EditingSchedule;
        app: AppSettings;
    },
    token: string,
): Promise<{ user: UserSettings; schedule: Schedule; app: AppSettings }> {
    // map over each element of the schedule
    const convertedSchedule = Object.fromEntries(
        Object.entries(newSettings.schedule).map(([block, teachers]) => [
            block,
            // break up teacher names
            teachers.map((teacherName) => {
                const split = splitName(teacherName);
                return {
                    first: split[0],
                    last: split[1],
                };
            }),
        ]),
    );
    const splitUser = splitName(newSettings.user.name);
    const convertedUserSettings = {
        first: splitUser[0],
        last: splitUser[1],
        grade: newSettings.user.grade,
        school: newSettings.user.school,
    };
    const convertedAppSettings = {
        showFreeAsAbsent: newSettings.app.showFreeBlocks,
        notify: newSettings.app.sendNotifications,
        notifyWhenNone: newSettings.app.sendNoAbsenceNotification,
    };

    const response = await getFromAPI(
        {
            method: 'PUT',
            path: '/users/me/update/',
            token,
            body: {
                profile: convertedUserSettings,
                schedule: convertedSchedule,
                settings: convertedAppSettings,
                fcm: {
                    token: '',
                },
            },
        },
        'Save Settings',
    );

    // const responseStr = await fetch(url('/users/me/update'), {
    //     method: 'PUT',
    //     headers: getHeaders(token),
    //     body: JSON.stringify({
    //         profile: convertedUserSettings,
    //         schedule: convertedSchedule,
    //         fcm: {
    //             token: '',
    //         },
    //     }),
    // });
    // if (!responseStr.ok) {
    //     throw new Error(
    //         `saveSettings failed with error ${
    //             responseStr.status
    //         }: ${await responseStr.text()}`,
    //     );
    // }

    // const response = await responseStr.json();

    return {
        user: {
            name: joinName(response.profile.first, response.profile.last),
            school: strToSchool(response.profile.school),
            grade: numToGrade(response.profile.grade),
        },
        schedule: apiResponseToSchedule(response.schedule),
        app: {
            showFreeBlocks:
                response.settings?.showFreeAsAbsent ??
                DefaultAppSettings.showFreeBlocks,
            sendNotifications:
                response.settings?.notify ??
                DefaultAppSettings.sendNotifications,
            sendNoAbsenceNotification:
                response.settings?.notifyWhenNone ??
                DefaultAppSettings.sendNoAbsenceNotification,
        },
    };
}

export async function saveSchedule(
    newSettings: EditingSchedule,
    token: string,
): Promise<Schedule> {
    // map over each element of the schedule
    const convertedSchedule = Object.fromEntries(
        Object.entries(newSettings).map(([block, teachers]) => [
            block,
            // break up teacher names
            teachers.map((teacherName) => {
                const split = splitName(teacherName);
                return {
                    first: split[0],
                    last: split[1],
                };
            }),
        ]),
    );

    // const responseStr = await fetch(url('/users/me/update/schedule'), {
    //     method: 'PUT',
    //     headers: getHeaders(token),
    //     body: JSON.stringify(convertedSchedule),
    // });
    // if (!responseStr.ok) {
    //     throw new Error(
    //         `saveSchedule failed with error ${
    //             responseStr.status
    //         }: ${await responseStr.text()}`,
    //     );
    // }

    // const response = await responseStr.json();

    const response = await getFromAPI(
        {
            method: 'PUT',
            path: '/users/me/update/schedule/',
            token,
            body: convertedSchedule,
        },
        'Save Schedule',
    );

    return apiResponseToSchedule(response);
}

export async function saveUserSettings(
    newSettings: UserSettings,
    token: string,
) {
    const split = splitName(newSettings.name);
    const convertedUserSettings = {
        first: split[0],
        last: split[1],
        grade: newSettings.grade,
        school: newSettings.school,
    };

    // const responseStr = await fetch(url('/users/me/update/profile'), {
    //     method: 'PUT',
    //     headers: getHeaders(token),
    //     body: JSON.stringify(convertedUserSettings),
    // });
    // if (!responseStr.ok) {
    //     throw new Error(
    //         `saveUserSettings failed with error ${
    //             responseStr.status
    //         }: ${await responseStr.text()}`,
    //     );
    // }

    return getFromAPI(
        {
            method: 'PUT',
            path: '/users/me/update/profile/',
            token,
            body: convertedUserSettings,
        },
        'Save User Settings',
    );
}

export async function saveAppSettings(newSettings: AppSettings, token: string) {
    const convertedAppSettings = {
        showFreeAsAbsent: newSettings.showFreeBlocks,
        notify: newSettings.sendNotifications,
        notifyWhenNone: newSettings.sendNoAbsenceNotification,
    };

    // const responseStr = await fetch(url('/users/me/update/profile'), {
    //     method: 'PUT',
    //     headers: getHeaders(token),
    //     body: JSON.stringify(convertedUserSettings),
    // });
    // if (!responseStr.ok) {
    //     throw new Error(
    //         `saveUserSettings failed with error ${
    //             responseStr.status
    //         }: ${await responseStr.text()}`,
    //     );
    // }

    return getFromAPI(
        {
            method: 'PUT',
            path: '/users/me/update/settings/',
            token,
            body: convertedAppSettings,
        },
        'Save App Settings',
    );
}

export async function logout(token: string) {
    return getFromAPI(
        {
            method: 'PUT',
            path: '/logout/',
            token,
        },
        'Logout',
    );
}

export async function searchTeachers(
    searchString: string,
    school: SchoolName,
    token: string,
): Promise<string[]> {
    // const responseStr = await fetch(url('/teachers/autocomplete'), {
    //     method: 'POST',
    //     headers: getHeaders(token),
    //     body: JSON.stringify({
    //         name: searchString,
    //         school,
    //     }),
    // });
    // if (!responseStr.ok) {
    //     throw new Error(
    //         `searchTeachers failed with error ${
    //             responseStr.status
    //         }: ${await responseStr.text()}`,
    //     );
    // }

    // const response = await responseStr.json();

    const response = await getFromAPI(
        {
            method: 'POST',
            path: '/teachers/autocomplete/',
            token,
            body: {
                name: searchString,
                school,
            },
        },
        'Search Teachers',
    );

    return response.suggestions;
}

export async function isRealTeacher(
    partialName: string,
    school: SchoolName,
    token: string,
): Promise<{
    isReal: boolean;
    similar: string[];
}> {
    // const responseStr = await fetch(url('/teachers/validate'), {
    //     method: 'POST',
    //     headers: getHeaders(token),
    //     body: JSON.stringify({
    //         name: partialName,
    //         school,
    //     }),
    // });
    // if (!responseStr.ok) {
    //     throw new Error(
    //         `isRealTeacher failed with error ${
    //             responseStr.status
    //         }: ${await responseStr.text()}`,
    //     );
    // }

    // const response = await responseStr.json();

    const response = await getFromAPI(
        {
            method: 'POST',
            path: '/teachers/validate/',
            token,
            body: {
                name: partialName,
                school,
            },
        },
        'Real Teacher Check',
    );

    return {
        isReal: response.value,
        similar: response.value
            ? [response.formatted]
            : response.suggestions.slice(0, 2),
    };
}

export async function login(accessToken: string): Promise<{
    token: string;
    refresh: string;
    onboarded: boolean;
}> {
    // const responseStr = await fetch(url('/login'), {
    //     method: 'POST',
    //     headers: new Headers(headers),
    //     body: JSON.stringify({
    //         token: accessToken,
    //     }),
    // });
    // if (!responseStr.ok) {
    //     throw new Error(
    //         `login failed with error ${
    //             responseStr.status
    //         }: ${await responseStr.text()}`,
    //     );
    // }

    // const response = await responseStr.json();

    // return response;

    return getFromAPI(
        {
            method: 'POST',
            path: '/login/',
            body: {
                token: accessToken,
            },
        },
        'Login',
    );
}

export async function refresh(refreshToken: string): Promise<{
    token: string;
    refresh: string;
    onboarded: boolean;
}> {
    // this fails without the trailing slash. thanks react native.
    // const responseStr = await fetch(url('/refresh/'), {
    //     method: 'POST',
    //     headers: getHeaders(refreshToken),
    // });

    // // throw new Error('ugh');
    // if (!responseStr.ok) {
    //     throw new Error(
    //         `refresh failed with error ${
    //             responseStr.status
    //         }: ${await responseStr.text()}`,
    //     );
    // }

    // const response = await responseStr.json();

    // return response;

    return getFromAPI(
        {
            method: 'POST',
            path: '/refresh/',
            token: refreshToken,
        },
        'Refresh Token',
    );
}

export async function saveFCMToken(fcmToken: string, token: string) {
    // const responseStr = await fetch(url('/users/me/update/profile'), {
    //     method: 'PUT',
    //     headers: getHeaders(token),
    //     body: JSON.stringify(convertedUserSettings),
    // });
    // if (!responseStr.ok) {
    //     throw new Error(
    //         `saveUserSettings failed with error ${
    //             responseStr.status
    //         }: ${await responseStr.text()}`,
    //     );
    // }

    return getFromAPI(
        {
            method: 'PUT',
            path: '/users/me/update/fcm/',
            token,
            body: {
                token: fcmToken,
            },
        },
        'Save FCM Token',
    );
}

export async function deleteAccount(token: string) {
    return getFromAPI(
        {
            method: 'PUT',
            path: '/users/me/delete/',
            token,
        },
        'Delete Account',
    );
}
