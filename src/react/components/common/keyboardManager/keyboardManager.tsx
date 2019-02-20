import React from "react";
import { KeyboardRegistrationManager } from "./keyboardRegistrationManager";

export const KeyboardContext = React.createContext<IKeyboardContext>(null);

/**
 * Types of Key events supported by registration manager
 */
export enum KeyEventType {
    KeyDown = "keydown",
    KeyUp = "keyup",
    KeyPress = "keypress",
}

export interface IKeyboardContext {
    keyboard: KeyboardRegistrationManager;
}

export class KeyboardManager extends React.Component<any, IKeyboardContext> {
    public static contextType = KeyboardContext;

    public state: IKeyboardContext = {
        keyboard: new KeyboardRegistrationManager(),
    };

    private nonSupportedKeys = new Set(["Ctrl", " Control", "Alt"]);
    private inputElementTypes = new Set(["input", "textarea"]);

    public componentDidMount() {
        window.addEventListener(KeyEventType.KeyDown, this.onKeyboardEvent);
        window.addEventListener(KeyEventType.KeyUp, this.onKeyboardEvent);
        window.addEventListener(KeyEventType.KeyPress, this.onKeyboardEvent);
    }

    public componentWillUnmount() {
        window.removeEventListener(KeyEventType.KeyDown, this.onKeyboardEvent);
        window.removeEventListener(KeyEventType.KeyUp, this.onKeyboardEvent);
        window.removeEventListener(KeyEventType.KeyPress, this.onKeyboardEvent);
    }

    public render() {
        return (
            <KeyboardContext.Provider value={this.state}>
                {this.props.children}
            </KeyboardContext.Provider>
        );
    }

    private getKeyParts(evt: KeyboardEvent) {
        const keyParts = [];
        if (evt.ctrlKey) {
            keyParts.push("Ctrl+");
        }
        if (evt.altKey) {
            keyParts.push("Alt+");
        }
        keyParts.push(evt.key);
        return keyParts.join("");
    }

    private onKeyboardEvent = (evt: KeyboardEvent) => {
        if (this.isDisabled() || this.nonSupportedKeys.has(evt.key)) {
            return;
        }

        const keyEventType = this.getKeyEventType(evt.type);
        this.state.keyboard.invokeHandlers(keyEventType, this.getKeyParts(evt), evt);
    }

    private isDisabled(): boolean {
        return document.activeElement && this.inputElementTypes.has(document.activeElement.tagName.toLowerCase());
    }

    private getKeyEventType(eventType: string): KeyEventType {
        switch (eventType) {
            case "keydown":
                return KeyEventType.KeyDown;
            case "keyup":
                return KeyEventType.KeyUp;
            case "keypress":
                return KeyEventType.KeyPress;
            default:
                throw new Error("Unrecognized key event type");
        }
    }
}
