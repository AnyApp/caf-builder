/**
 * Created by dvircn on 22/10/14.
 */
var BBuildGenerator = Class({
    $singleton: true,
    data: {},
    build: function(){
        var builder = new CBuilderObjects();
        builder.create('AppContainer','app-container').childs(['main-view']);
        builder.create('MainView','main-view').childs(['header','content','footer']);
        builder.create('Header','header')
            .headerLeft(['header-button-back'])
            .headerRight(['header-button-create-app'])
            .design({bgColor:CColor('Indigo',10),color: CColor('White')});
        //Add Design.
        builder.addDesign('header-button',{active: { bgColor:CColor('Gray',17) }  });
        builder.create('Button','header-button-create-app')
            .design({parents:['header-button']})
            .icon('plus37',38,'',CColor('White')).link('create-app');
        builder.create('Button','header-button-back')
            .design({parents:['header-button']})
            .icon('left46',34,'',CColor('White')).backButton();
        builder.create('Footer','footer').child('footer-message')
            .design({bgColor:{color:'Indigo',level:10}});
        builder.create('Label','footer-message').text('By Codletech')
            .design({color:CColor('White'),textAlign:'center',fontWeight:'normal'});
        builder.create('Content','content')
            .child('page-main')
            .child('page-create-application')
            .child('page-update-application')
            .child('page-launch-application');

        BBuildGenerator.createPageMain(builder);
        BBuildGenerator.createPageCreateApp(builder);
        BBuildGenerator.createPageUpdateApp(builder);
        BBuildGenerator.createPageLaunchApp(builder);

        BBuildGenerator.data = builder.build();
        CAppUpdater.saveApp(BBuildGenerator.data);
        CLog.dlog('Builder Application Data Saved.')
    },
    createPageMain: function (builder) {
        // Main Page
        builder.create('Page', 'page-main')
            .page('', 'Application Builder', function () {
            } /* Optional On Page Load */)
            .child('page-main-label-current-app')
            .child('page-main-button-change-app')
            .child('page-main-button-create-app')
            .child('page-main-button-update-app')
            .child('page-main-button-launch-app')
            .child('page-main-button-compile-app')
            .child('page-main-button-publish-app');
        builder.create('Label', 'page-main-label-current-app')
            .text('Current App: None')
            .design({parents: ['main-button'],
                widthSM: 7, color: CColor('Teal', 12),
                fontWeight: 'bold'
            });
        builder.create('Button', 'page-main-button-change-app')
            .text('Choose Application')
            .icon('retweet6', 40, 'right', CColor('White'))
            .design({ parents: ['main-button'],
                widthSM: 3, bgColor: CColor('DarkRed', 10)
            })
            .showDialog({
                title: 'Choose Application',
                list:co('Template')
                    .template('http://codletech-builder.herokuapp.com/getAllApps',true,
                                {fields:['appName']})
                    .templateObject(
                        co('Button')
                            .iconRight('right65',28).iconLeft('#this.data.icon',28)
                            .design({textAlign:'left',color:CColor('DeepPurple',10)})
                            .text('#.data.appName')
                            .build()
                    )
                    .templateItemOnClick(function(index,data){
                        data = data || {};
                        var appName  = data.appName || 'None';
                        CLabel.setLabelText('page-main-label-current-app',
                            'Current App: ' + appName);
                        // Set Globals current app.
                        CGlobals.set('currentAppID',data._id);
                        CGlobals.set('currentAppName',data.appName);
                    })
                    .templateBorder(CColor('DeepPurple',7),4)
                    .templateContainerDesign({})// can change/append item container design.
                    .build(),
                hideOnListChoose: true,
                dialogColor: CColor('DeepPurple',10)
            })
        ;
        builder.addDesign('main-button',
            {   textAlign: 'left', fontWeight: 'normal',fontSize:17,
                color: CColor('White'), paddingLeft:10,
                widthSM: 5, widthXS: 11, height: 55, boxSizing: 'borderBox',
                marginTop: 6, marginLeft: 1, marginRight: 1,
                active: { bgColor: CColor('Gray', 17) }
            });
        builder.create('Button', 'page-main-button-create-app')
            .text('Create Application').link('create-app')
            .icon('plus37', 40, 'right', CColor('White'))
            .design({parents: ['main-button'], bgColor: CColor('Teal', 12)});
        builder.create('Button', 'page-main-button-update-app')
            .text('Update Application').link('update-app')
            .link('update-app',{},{appName:'currentAppName',appID:'currentAppID'})
            .icon('arrow556', 40, 'right', CColor('White'))
            .design({parents: ['main-button'], bgColor: CColor('DeepOrange', 12)});
        builder.create('Button', 'page-main-button-launch-app')
            .text('Launch Application')
            .link('launch-app',{},{appName:'currentAppName',appID:'currentAppID'})
            .icon('rocket22', 40, 'right', CColor('White'))
            .design({parents: ['main-button'], bgColor: CColor('Indigo', 12)});
        builder.create('Button', 'page-main-button-compile-app')
            .text('Compile Application')
            .icon('wrench46', 40, 'right', CColor('White'))
            .design({parents: ['main-button'], bgColor: CColor('LightPink', 12)})
            .onClick(function(){
                var appId = CGlobals.get('currentAppID');
                CNetwork.request(BAppsHandler.compileAppURL,{appID:appId},
                    function(res){CLog.dlog(res);},function(err){CLog.error('error');CLog.dlog(err);});
            });
        builder.create('Button', 'page-main-button-publish-app')
            .text('Publish Application')
            .icon('upload48', 40, 'right', CColor('White'))
            .design({parents: ['main-button'], bgColor: CColor('Brown', 6)})
            .onClick(function(){
                var appId = CGlobals.get('currentAppID');
                CNetwork.request(BAppsHandler.publishAppURL,{appID:appId},
                    function(res){CLog.dlog(res);},function(err){CLog.error('error');CLog.dlog(err);});
            });
    },
    createPageUpdateApp: function (builder) {
        builder.addDesign('update-form-label',
            {   textAlign: 'left', fontWeight: 'normal',fontSize:17,
                color: CColor('White'), paddingLeft:10,
                widthSM: 5, widthXS: 11, height: 42, boxSizing: 'borderBox',
                marginTop: 6, marginLeft: 1, marginRight: 1,
                bgColor: CColor('Cyan',10)
            });
        builder.addDesign('update-text-input',
            {   textAlign: 'left', fontWeight: 'normal', fontSize: 18,
                widthSM: 5, widthXS: 11, height: 42, boxSizing: 'borderBox',
                marginTop: 6, marginLeft: 1, marginRight: 1
            });

        // Update Application
        builder.create('TemplatePage', 'page-update-application')
            .page('update-app', 'Update Application - #.data.appName')
            .pageOnLoad(function(){
                var label = CObjectsHandler.relativeObject(thisObject,'page-update-app-send-response');
                CLabel.setLabelText(label,
                    'App Name: ' + thisObject.data.appName);
            })
            .templateRootObjects(['#/page-update-app-form'])
            .templateObjects([
                co('Form', '#/page-update-app-form')
                    .formInputs([
                        '#/page-update-app-form-input-id',
                        '#/page-update-app-form-input-data',
                        '#/page-update-app-form-input-name',
                        '#/page-update-app-form-input-uri'
                    ])
                    .formSaveToUrl(BAppsHandler.updateAppURL)
                    .formSaveToUrlCallback(function (responseData) {
                        responseData = responseData || {};
                        CLog.dlog(responseData);
                    })
                    .formPrepareValues(function(values){
                        // Prepare values to send.
                        delete values.appDatafile;
                        var appData = CPageData.get('appData') || {};
                        var finalValues = CUtils.mergeJSONs(values,appData);
                        var tempValues = {"author":"Tal Levi","keywords":"Test Application","website":"http://codletech.net","mail":"tallevi12@gmail.com","supportUrl":"http://codletech.net","phone":"0526474299","policy":"no policy yet","appDescription":"Tal is GeverGever","appPreferences":[{"name":"permissions","value":"none"},{"name":"phonegap-version","value":"3.6.3"},{"name":"orientation","value":"default"},{"name":"target-device","value":"universal"},{"name":"fullscreen","value":"false"},{"name":"prerendered-icon","value":"true"},{"name":"ios-statusbarstyle","value":"black-opaque"},{"name":"detect-data-types","value":"true"},{"name":"exit-on-suspend","value":"false"},{"name":"disable-cursor","value":"false"},{"name":"android-minSdkVersion","value":"7"},{"name":"android-installLocation","value":"auto"}],"plugins":[{"name":"org.apache.cordova.device"},{"name":"org.apache.cordova.splashscreen"}],"icons":{"defaultIcon":"http://codletech.net/wp-content/uploads/2014/10/logo.png"    } };
                        finalValues = CUtils.mergeJSONs(tempValues,finalValues);
                        CLog.dlog(finalValues);
                        return finalValues;
                    })
                    .childs([
                        '#/page-update-app-form-label-id',
                        '#/page-update-app-form-input-id',
                        '#/page-update-app-form-label-data',
                        '#/page-update-app-form-input-data',
                        '#/page-update-app-form-label-name',
                        '#/page-update-app-form-input-name',
                        '#/page-update-app-form-label-uri',
                        '#/page-update-app-form-input-uri',
                        '#/page-update-app-form-send-to-url-button',
                        '#/page-update-app-form--clear-button'
                    ])
                    .design({ widthXS: 10, padding: 5, marginTop: 10 })
                    .build(),
                co('Label', '#/page-update-app-form-label-id')
                    .design({parents:['update-form-label']})
                    .text('App ID')
                    .build(),
                co('Input', '#/page-update-app-form-input-id')
                    .inputName('appID')
                    .design({parents:['update-text-input']})
                    .inputValue('#.data.appID')
                    .inputDisabled()
                    .build(),
                co('Label', '#/page-update-app-form-label-data')
                    .design({parents:['update-form-label']})
                    .text('App Data')
                    .build(),
                co('Input', '#/page-update-app-form-input-data')
                    .inputName('appDatafile')
                    .inputType('file')
                    .inputOnFileSelect(function(evt){
                        //Retrieve the file from the FileList object
                        var file = evt.target.files[0];
                        if (CUtils.isEmpty(file))
                            CLog.error("Failed to load file");
                        else
                            BCafAppDataFilesHandler.fileToAppData(file);
                    })
                    .design({parents:['update-text-input'],
                        inline:'border: none;line-height: 0px;height: auto;'})
                    .build(),
                co('Label', '#/page-update-app-form-label-name')
                    .design({parents:['update-form-label']})
                    .text('App Name')
                    .build(),
                co('Input', '#/page-update-app-form-input-name')
                    .inputName('appName')
                    .design({parents:['update-text-input']})
                    .inputValue('#.data.appName')
                    .build(),
                co('Label', '#/page-update-app-form-label-uri')
                    .design({parents:['update-form-label']})
                    .text('App URI')
                    .build(),
                co('Input', '#/page-update-app-form-input-uri')
                    .inputName('appUri')
                    .design({parents:['update-text-input']})
                    .inputValue('')
                    .build(),

                co('Button', '#/page-update-app-form-send-to-url-button')
                    .design({parents: ['main-button'], bgColor: CColor('Teal', 12)})
                    .text('Update Application').icon('right43', 40, 'right', CColor('White'))
                    .formSendToUrlButton('#/page-update-app-form')
                    .build(),
                co('Button', '#/page-update-app-form--clear-button')
                    .design({parents: ['main-button'], bgColor: CColor('Red', 12)})
                    .text('Clear').icon('right43', 40, 'right', CColor('White'))
                    .formClearButton('#/page-update-app-form')
                    .build()
        ]);
    },
    createPageCreateApp: function (builder) {
        // Create Application
        builder.create('Page', 'page-create-application')
            .page('create-app', 'Create Application')
            .child('page-create-app-form')
            .child('page-create-app-send-response');
        builder.create('Form', 'page-create-app-form')
            .formInputs(['page-create-app-form-input-name', 'page-create-app-form-input-uri'])
            .formSaveToUrl(BAppsHandler.createAppURL)
            .formSaveToUrlCallback(function (responseData) {
                responseData = responseData || {};
                CLabel.setLabelText('page-create-app-send-response',
                    'Created App ID: ' + responseData._id);
            })
            .childs(['page-create-app-form-input-name', 'page-create-app-form-input-uri',
                'page-create-app-form-send-to-url-button', 'page-create-app-form-clear-button'])
            .design({ widthXS: 10, padding: 5, marginTop: 10 });
        //Add Design.
        builder.addDesign('text-input',
            {   textAlign: 'left', fontWeight: 'normal', fontSize: 18,
                widthSM: 5, widthXS: 11, height: 42, boxSizing: 'borderBox',
                marginTop: 6, marginLeft: 1, marginRight: 1
            });
        builder.create('Input', 'page-create-app-form-input-name')
            .inputName('appName')
            .inputPlaceholder('Enter Application Name')
            .design({parents:['text-input']});
        builder.create('Input', 'page-create-app-form-input-uri')
            .inputName('appURI')
            .inputPlaceholder('Enter Application URI')
            .design({parents:['text-input']});
        //Add Design.
        builder.create('Button', 'page-create-app-form-send-to-url-button')
            .design({parents: ['main-button'], bgColor: CColor('Teal', 12)})
            .text('Create Application').icon('right43', 40, 'right', CColor('White'))
            .formSendToUrlButton('page-create-app-form');
        builder.create('Button', 'page-create-app-form-clear-button')
            .design({parents: ['main-button'], bgColor: CColor('Red', 12)})
            .text('Clear').icon('right43', 40, 'right', CColor('White'))
            .formClearButton('page-create-app-form');
        builder.create('Label', 'page-create-app-send-response')
            .design({parents: ['main-button'], selectable: true, widthXS: 12, color: CColor('Indigo', 10), bgColor: CColor('White', 12)})
            .text('');
    },
    createPageLaunchApp: function (builder) {
        // Create Application
        builder.create('Page', 'page-launch-application')
            .page('launch-app', 'Launch Application')
            .child('page-launch-app-app-name')
            .child('page-launch-app-app-iframe')
            .pageOnLoad(function(params){
                var appID   = params.appID || '';
                var appName = params.appName || '';
                if (!CUtils.isEmpty(appName))
                    CLabel.setLabelText('page-launch-app-app-name',
                        'Launched App: ' + appName);

                if (CUtils.isEmpty(appID))
                    return;
                var appIFrame = CUtils.element('page-launch-app-app-iframe');
                appIFrame.src = 'app-launcher.html';

            });
        builder.create('Label', 'page-launch-app-app-name')
            .design({parents: ['main-button'], fontWeight:'bold',
                widthXS: 12,widthSM: 12,textAlign:'center',height:40,
                color: CColor('Indigo', 10), bgColor: CColor('White', 12)})
            .text('');
        builder.create('IFrame', 'page-launch-app-app-iframe')
            .design({height:'85%', marginTop:2,marginBottom:10,widthXS: 10,widthSM: 11});

    },

});

window.setTimeout(BBuildGenerator.build,1000);


