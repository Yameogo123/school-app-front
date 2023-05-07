
const userState={
    user: "",
    token: "",
    profil: ""
}

const themeState={
    back: "snow",
    front : "black",
    chart : "skyblue"
}

export function UserReducer(state= userState, action){
    let newState;

    switch (action.type) {
        case "login":
            newState= {...state, user: action.value.user, token: action.value.token}
            return newState || state
        case "logout":
            newState= {...state, user: "", token: ""}
            return newState || state
        case "profil":
            newState= {...state, profil: action.value}
            return newState || state
        case "refresh-token":
            newState= {...state, token: action.value}
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