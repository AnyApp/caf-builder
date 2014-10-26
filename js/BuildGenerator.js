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
        this.createPageMain(builder);
        this.createPageCreateApp(builder);
        this.createPageUpdateApp(builder);
        this.createPageLaunchApp(builder);

        BBuildGenerator.data = builder.build();
        CAppUpdater.saveApp(BBuildGenerator.data);
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
            .child('page-main-button-launch-app');
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
                        CGlobals.setGlobal('currentAppID',data._id);
                        CGlobals.setGlobal('currentAppName',data.appName);
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
    },
    createPageUpdateApp: function (builder) {
        // Update Application
        builder.create('TemplatePage', 'page-update-application')
            .page('update-app', 'Update Application')
            .pageOnLoad(function(){
                CLog.dlog(thisObject);
                var label = CObjectsHandler.relativeObject(thisObject,'page-update-app-send-response');
                CLog.dlog(label);

                CLabel.setLabelText(label,
                    'App Name: ' + thisObject.data.appName);
            })
            .templateRootObjects(['#/page-update-app-form'])
            .templateObjects([
                co('Form', '#/page-update-app-form')
                    .formInputs(['page-update-app-form-input-id', 'page-update-app-form-input-data'])
                    .formSaveToUrl(BAppsHandler.updateAppURL)
                    .formSaveToUrlCallback(function (responseData) {
                        responseData = responseData || {};
                        var label = CObjectsHandler.relativeObject(thisObject,'page-update-app-send-response');
                        label.setText('Created App ID: ' + responseData._id || 'none' + ' - Keep it!');
                        label.rebuild();
                    })
                    .childs(['#/page-update-app-form-input-id', '#/page-update-app-form-input-data',
                        '#/page-update-app-form-send-to-url-button', '#/page-update-app-form--clear-button',
                        '#/page-update-app-send-response'])
                    .design({ widthXS: 10, padding: 5, marginTop: 10 })
                    .build(),
                co('Input', '#/page-update-app-form-input-id')
                    .inputName('appName')
                    .inputPlaceholder('Enter Application Name')
                    .design({parents:['text-input']})
                    .inputPlaceholder('#.data.appName')
                    .build(),
                co('Input', '#/page-update-app-form-input-data')
                    .inputName('appUri')
                    .inputPlaceholder('Enter Application URI')
                    .design({parents:['text-input']})
                    .inputPlaceholder('#.data.appUri')
                    .build(),
                co('Button', '#/page-update-app-form-send-to-url-button')
                    .design({parents: ['main-button'], bgColor: CColor('Teal', 12)})
                    .text('Create Application').icon('right43', 40, 'right', CColor('White'))
                    .formSendToUrlButton('#/page-update-app-form')
                    .build(),
                co('Button', '#/page-update-app-form--clear-button')
                    .design({parents: ['main-button'], bgColor: CColor('Red', 12)})
                    .text('Clear').icon('right43', 40, 'right', CColor('White'))
                    .formClearButton('#/page-update-app-form')
                    .build(),
                co('Label', '#/page-update-app-send-response')
                    .design({parents: ['main-button'], selectable: true, widthXS: 12, color: CColor('Indigo', 10), bgColor: CColor('White', 12)})
                    .text('')
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

BBuildGenerator.build();


