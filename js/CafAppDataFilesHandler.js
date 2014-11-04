/**
 * Created by dvircn on 27/10/14.
 */
var BCafAppDataFilesHandler = Class({
    $singleton: true,
    fileToAppData: function(file){
        if (CUtils.stringEndsWith(file.name,'.js'))
            BCafAppDataFilesHandler.fileContent(file,BCafAppDataFilesHandler.handleJSFile);
        else
            BCafAppDataFilesHandler.fileContent(file,BCafAppDataFilesHandler.handleDCAFFile);
    },
    handleJSFile: function(content){
        CPageData.set('appData',eval(content));
    },
    handleDCAFFile: function(content){
        CPageData.set('appData',JSONfn.parse(content));
    },
    fileContent: function(file,callback){
        var r = new FileReader();
        r.onload = (function (file) {
            return function (e) {
                var contents = e.target.result;
                callback(contents);
            };
        })(file);
        r.readAsText(file);
    }

});

