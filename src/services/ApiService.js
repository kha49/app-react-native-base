import LanguageService from './LanguageService';
import mushroom from './mushroom.api.def';
import { blockUi, unblockUi } from '../shared/global'

window.requestCount = 0;

//let ApiService = {};

let ApiService = (objData) => {

    if (window.requestCount == 0 && !objData.dontLoading) {
        blockUi();
    }
    window.requestCount += 1;

    // let objData = {
    //   module: "",  //required string
    //   type: "", //required string
    //   viewAction: "",
    // message: {
    //   success: "", //string | null | comment | hidden
    //   error: "",  //string | null | comment
    // },
    //   value: {},  //option {} | [] | null | comment
    //   params: {}  //option {} | [] | null | comment
    // }


    if (objData.type && objData.type != "views") {    
        return mushroom[objData.module][objData.type + "Async"](objData.value, objData.params)
            .then(response => {
                console.log("response: %o %o", response, objData);
                checkSuccess(response, objData);
                return response;
            })
            .catch(error => {
                checkError(error, objData);
                throw error;
            });
    } else {
        return mushroom[objData.module].views[objData.viewAction + "Async"](objData.value, objData.params)
            .then(response => {
                // console.log("response: %o %o", response, objData);
                checkSuccess(response, objData);
                return response;
            })
            .catch(error => {
                checkError(error, objData);
                throw error;
            });
    }

};

ApiService.clearCache = (url) => {
    mushroom.$cache.invalid(url);
};

function checkSuccess(res, objData) {

    window.requestCount -= 1;
    if (window.requestCount == 0) {
        unblockUi();
    }
    if (objData.message && objData.message.success && objData.message.success == "hidden") {
        return;
    }
    if (objData.message && objData.message.success && objData.message.success != "hidden") {
        toastr.success(objData.message.success);
    } else {
        if (objData.type == "create") {
            toastr.success(LanguageService.lang.c_addSuccess);
        } else if (objData.type == "partialUpdate") {
            toastr.success(LanguageService.lang.c_updateSuccess);
        } else if (objData.type == "delete") {
            toastr.success(LanguageService.lang.c_deleteSuccess);
        } else if (objData.type == "batchDelete") {
            if (res.meta && res.meta.successIds && res.meta.successIds.length > 0) {
                toastr.success(LanguageService.lang.c_delete + " " + res.meta.successIds.length + " " + LanguageService.lang.c_recordSuccess);
            }
            if (res.meta && res.meta.failureIds && res.meta.failureIds.length > 0) {
                toastr.error(LanguageService.lang.c_delete + " " + res.meta.failureIds.length + " " + LanguageService.lang.c_recordError);
            }
        }
    }
}

function checkError(err, objData) {

    window.requestCount -= 1;
    if (window.requestCount == 0) {
        unblockUi();
    }
    if (objData.message && objData.message.error && objData.message.error == "hidden") {
        return;
    }
    if (objData.message && objData.message.error && objData.message.error != "hidden") {
        toastr.error(objData.message.error);
    } else {
        if (objData.type == "findById") {
            toastr.error(LanguageService.lang.c_findError);
        } else if (objData.type == "list") {
            toastr.error(LanguageService.lang.c_findError);
        } else if (objData.type == "create") {
            toastr.error(LanguageService.lang.c_addError);
        } else if (objData.type == "partialUpdate") {
            toastr.error(LanguageService.lang.c_updateError);
        } else if (objData.type == "batchDelete") {
            toastr.error(LanguageService.lang.c_deleteError);
        } else if (objData.type == "views") {
            toastr.error(LanguageService.lang.c_findError);
        } else {
            toastr.error(LanguageService.lang.c_findError);
        }

    }
}


export default ApiService;