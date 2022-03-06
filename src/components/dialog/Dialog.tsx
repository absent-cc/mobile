import React from 'react';
import { View, StyleSheet } from 'react-native';

interface DialogStateType {
    isOpen: boolean;
    children?: React.ReactNode;
}

interface DialogContextType {
    state: DialogStateType;
    open: (children: React.ReactNode) => void;
    close: () => void;
    displayer: React.ReactNode;
}

const defaultState: DialogContextType = {
    state: {
        isOpen: false,
    },
    open: () => undefined,
    close: () => undefined,
    displayer: null,
};

const DialogContext = React.createContext<DialogContextType>(defaultState);

export function Dialog({ children }: { children: React.ReactNode }) {
    const [state, setState] = React.useState<DialogStateType>(
        defaultState.state,
    );

    const open = React.useCallback((dialogChildren: React.ReactNode) => {
        setState({
            isOpen: true,
            children: dialogChildren,
        });
    }, []);

    const close = React.useCallback(() => {
        setState({
            isOpen: false,
        });
    }, []);

    const displayer = React.useMemo(() => {
        return <View style={styles.dialog}>{state.children}</View>;
    }, [state.children]);

    const contextValue = React.useMemo(
        () => ({
            state,
            open,
            close,
            displayer,
        }),
        [close, open, state, displayer],
    );

    return (
        <DialogContext.Provider value={contextValue}>
            {children}
        </DialogContext.Provider>
    );
}

const styles = StyleSheet.create({
    dialog: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flex: 1,
    },
});

export function useDialog() {
    return React.useContext(DialogContext);
}
