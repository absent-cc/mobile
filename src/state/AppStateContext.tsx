import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppStateType {
    isLoggedIn: boolean;
}

export interface AppStateContextType {
    ready: boolean;
    value: AppStateType;
    resetAppState: () => void;
    setAppState: (
        setterFunction: (settings: AppStateType) => Partial<AppStateType>,
    ) => void;
}

// Default settings
export const defaultState: AppStateType = {
    isLoggedIn: false,
};

const AppStateContext = React.createContext<AppStateContextType>({
    ready: false,
    value: defaultState,
    resetAppState: () => {},
    setAppState: () => {},
});

export function AppStateProvider(props: any) {
    const [appState, setAppState] = React.useState<AppStateType>(defaultState);
    const [ready, setReady] = React.useState(false);

    // Save and read state
    React.useEffect(() => {
        const run = async () => {
            if (!ready) {
                // Read state
                const savedString = await AsyncStorage.getItem('appstate');

                if (savedString) {
                    let savedState;

                    try {
                        savedState = JSON.parse(savedString);
                    } catch (e) {
                        savedState = {};
                    }

                    setAppState({
                        ...defaultState,
                        ...savedState,
                    });
                } else {
                    setAppState({
                        ...defaultState,
                    });
                }
                setReady(true);
            } else {
                // Save state
                const stateString = JSON.stringify(appState);
                await AsyncStorage.setItem('appstate', stateString);
            }
        };

        run();
    }, [appState]);

    // Memoized just in case
    const resetAppState = React.useMemo(() => {
        return () => {
            setAppState({
                ...defaultState,
            });
        };
    }, [setAppState]);

    const appStateProp = {
        value: appState,
        ready,
        resetAppState: resetAppState,
        setAppState: setAppState,
    };

    return <AppStateContext.Provider {...props} value={appStateProp} />;
}

export function useAppState() {
    return React.useContext(AppStateContext);
}
