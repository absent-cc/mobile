import { timeStringToMinRep } from '../DateWordUtils';
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

const baseURLs = ['https://api.absent.cc/v2', 'https://dev.api.absent.cc/v2'];

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

const url = (backend: number, path: string): string => {
    return `${baseURLs[backend]}${path}`;
};

const getFromAPI = async (
    {
        backend,
        method,
        path,
        token,
        body,
    }: {
        backend: number;
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
        response = await fetch(url(backend, path), {
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
    backend: number,
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
            backend,
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
                // reversed for easier
                reversedSplitName: [
                    absence.teacher.last,
                    absence.teacher.first,
                ],
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

export async function fetchSettings(
    backend: number,
    token: string,
): Promise<{
    uid: string;
    user: UserSettings;
    schedule: Schedule;
    app: AppSettings;
}> {
    const response = await getFromAPI(
        {
            method: 'GET',
            path: '/users/me/',
            token,
            backend,
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

export async function fetchWeekSchedule(
    dateStr: string,
    school: SchoolName,
    backend: number,
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
                school,
            }).toString()}`,
            token,
            backend,
        },
        'Fetch Week Schedule',
    );

    const result: WeekSchedule = {};

    const convertSpecialBlocks = (block: string) => {
        if (block === 'CAT')
            return school === SchoolName.NSHS ? Block.LION : Block.TIGER;

        return block as Block;
    };

    response.forEach((day: DaySchedule) => {
        result[day.date] = {
            ...day,
            schedule: day.schedule.map((dayBlock: any) => ({
                ...dayBlock,
                startTime: timeStringToMinRep(dayBlock.startTime),
                endTime: timeStringToMinRep(dayBlock.endTime),
                block: convertSpecialBlocks(dayBlock.block),
                lunches:
                    dayBlock.lunches && dayBlock.lunches.length > 0
                        ? dayBlock.lunches.map((lunch: any) => ({
                              ...lunch,
                              startTime: timeStringToMinRep(lunch.startTime),
                              endTime: timeStringToMinRep(lunch.endTime),
                          }))
                        : null,
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
    backend: number,
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
            path: '/users/me/',
            token,
            backend,
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
    backend: number,
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
            path: '/users/me/schedule/',
            token,
            backend,
            body: convertedSchedule,
        },
        'Save Schedule',
    );

    return apiResponseToSchedule(response);
}

export async function saveUserSettings(
    newSettings: UserSettings,
    backend: number,
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
            path: '/users/me/profile/',
            token,
            backend,
            body: convertedUserSettings,
        },
        'Save User Settings',
    );
}

export async function saveAppSettings(
    newSettings: AppSettings,
    backend: number,
    token: string,
) {
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
            path: '/users/me/settings/',
            token,
            backend,
            body: convertedAppSettings,
        },
        'Save App Settings',
    );
}

export async function logout(backend: number, token: string) {
    return getFromAPI(
        {
            method: 'DELETE',
            path: '/logout/',
            token,
            backend,
        },
        'Logout',
    );
}

export async function searchTeachers(
    searchString: string,
    school: SchoolName,
    backend: number,
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
            backend,
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
    backend: number,
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
            backend,
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

export async function login(
    backend: number,
    accessToken: string,
): Promise<{
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
            backend,
        },
        'Login',
    );
}

export async function refresh(
    backend: number,
    refreshToken: string,
): Promise<{
    backend: number;
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
            backend,
        },
        'Refresh Token',
    );
}

export async function saveFCMToken(
    fcmToken: string,
    backend: number,
    token: string,
) {
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
            path: '/users/me/fcm/',
            token,
            backend,
            body: {
                token: fcmToken,
            },
        },
        'Save FCM Token',
    );
}

export async function deleteAccount(backend: number, token: string) {
    return getFromAPI(
        {
            method: 'DELETE',
            path: '/users/me/',
            token,
            backend,
        },
        'Delete Account',
    );
}
