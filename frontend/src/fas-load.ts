// importing the library
import { library } from "@fortawesome/fontawesome-svg-core";

// importing internal icons
import {
    faUser,
    faPaste,
    faAddressBook,
    faUsers,
    faExclamationCircle,
    faCheck,
faHeart,
faHeartBroken,
} from "@fortawesome/free-solid-svg-icons";

// importing the FAS pack
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// adding the imported icons to the library
library.add(
    faUser,
    faPaste,
    faAddressBook,
    faUsers,
    faExclamationCircle,
    faCheck,
    faHeart,
    faHeartBroken,
);

// exporting the pack
export {FontAwesomeIcon as fas};