/**
 * Created by dvircn on 22/10/14.
 */
var BAppsHandler = Class({
    $singleton: true,
    getAppURL:      'http://codletech-builder.herokuapp.com/getAppData',
    deleteAppURL:   'http://codletech-builder.herokuapp.com/NotExist',
    updateAppURL:   'http://codletech-builder.herokuapp.com/updateAppData',
    createAppURL:   'http://codletech-builder.herokuapp.com/newAppWithData',
    createApp: function(data,callback) {
        CNetwork.request(BAppsHandler.createAppURL,data,callback
        function(){ // Error
            CLog.error('Error in BAppsHandler: Requesting "createApp".');
            callback();
        });
    },
    updateApp: function(data,callback){
        CNetwork.request(BAppsHandler.updateAppURL,data,callback
        function(){ // Error
            CLog.error('Error in BAppsHandler: Requesting "updateApp".');
            callback();
        });
    },
    deleteApp: function(data,callback){
        CNetwork.request(BAppsHandler.deleteAppURL,data,callback
        function(){ // Error
            CLog.error('Error in BAppsHandler: Requesting "deleteApp".');
            callback();
        });
    },
    getAppData: function(id,callback){
        CNetwork.request(BAppsHandler.getAppURL,{appID: id,version: -1},callback
            function(){ // Error
                CLog.error('Error in BAppsHandler: Requesting "getAppData".');
                callback();
            });
    },


});