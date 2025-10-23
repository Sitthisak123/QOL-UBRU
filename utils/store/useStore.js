import { create } from 'zustand';


const useUserInfo = create((set) => ({
    USER_info: { isInit: false, isLogin: false, SSID: '', textUser: '', loginDate: '', Name: 'Unvailable'},
    login: (newstate) =>
        set((prevState) => ({
            USER_info: { ...newstate, isInit: true, isLogin: true, loginDate: new Date()}
        })),
    updateinfo: (newstate) =>
        set((prevState) => ({
            USER_info: { ...prevState.USER_info, ...newstate }
        })),
    logout: () => set(() => ({ USER_info: { isInit: true, isLogin: false, SSID: '', textUser: '', loginDate: '', Name: 'Unvailable' } })),

}));

const academicStore = create((set) => ({
    USER_info: { isInit: false, isLogin: false, SSID: '', textUser: '', loginDate: '', Name: 'Unvailable'},
    login: (newstate) =>
        set((prevState) => ({
            USER_info: { ...newstate, isInit: true, isLogin: true, loginDate: new Date()}
        })),
    updateinfo: (newstate) =>
        set((prevState) => ({
            USER_info: { ...prevState.USER_info, ...newstate }
        })),
    logout: () => set(() => ({ USER_info: { isInit: true, isLogin: false, SSID: '', textUser: '', loginDate: '', Name: 'Unvailable' } })),

}));

export { useUserInfo };
