import mushroom from 'mushroomjs-auth-rn';
// const rootApiUrl = 'http://warning-api.test2.siten.vn/api/warning/v1/';  
const rootApiUrl = 'http://tfs.siten.vn:41180/api/warning/v1/';

mushroom.maker.get_maker_by_userAsync = function (token) {
    return mushroom.__createAsyncRestFunction({
        name: "get_maker_by_userAsync",
        method: "GET",
        headers: {
            "token": token,
            "X-HTTP-Method-Override": "get_maker_by_user"
        },
        blankBody: true,
        url: rootApiUrl + "makers/get_maker_by_user"
    })();
};