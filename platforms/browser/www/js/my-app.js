document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    console.log('deviceready111');
    try{
        hasReadPermission();
    }
    catch(e)
    {
        console.log('error:  ' + e.message)
    }
    //  window.plugins.sim.getSimInfo(successCallback, errorCallback);
}


function successCallback(result) {
    console.log('successCallback');
    console.log(result);
}

function errorCallback(error) {
    console.log('error');
    console.log(error);
}

// Android only: check permission
function hasReadPermission() {
    window.plugins.sim.hasReadPermission(successCallback, errorCallback);
}

// Android only: request permission
function requestReadPermission() {
    window.plugins.sim.requestReadPermission(successCallback, errorCallback);
}