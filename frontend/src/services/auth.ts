
import { useUserStore } from '@/stores/user';
import { post } from './utils';

let user = useUserStore();

export function getCurrentUser() {
    return user;
}