import { combineReducers } from "redux";
import { reducer } from "./redux";

export default function getRootReducer(navReducer) {
    return combineReducers({
        nav: navReducer,
        reducer: reducer
    });
}
