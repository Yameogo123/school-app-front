import moment from "moment";

const userState={
    user: "",
    token: "",
    profil: "",
    connected: "disconnected",
    loading: true,
    log: ""
}

const themeState={
    back: "snow",
    front : "black",
    chart : "skyblue"
}

const paramState={
    langue: "fr",
    notification: true
}

export function UserReducer(state= userState, action){
    let newState;

    switch (action.type) {
        case "login":
            newState= {...state, user: action.value.user, token: action.value.token, log: moment().add(12, "hours").toISOString()}
            return newState || state
        case "logout":
            newState= {...state, user: "", token: "", connected: "disconnected", log: ""}
            return newState || state
        case "profil":
            newState= {...state, profil: action.value}
            return newState || state
        case "refresh-token":
            newState= {...state, token: action.value}
            return newState || state
        case "connexion":
            newState= {...state, connected: action?.value || "disconnected"}
            return newState || state
        case "loading":
            newState= {...state, loading: !state.loading}
            return newState || state
        case "log":
            newState= {...state, log: action.value}
            return newState || state
        default:
            return state
    }
}

export function ThemeReducer(state= themeState, action){
    let newState;

    switch (action.type) {
        case "light":
            newState= {...state, back: "snow", front: "black"}
            return newState || state
        case "dark":
            newState= {...state, back: "black", front: "snow"}
            return newState || state
        default:
            return state
    }
}
