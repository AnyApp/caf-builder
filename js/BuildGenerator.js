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
            .design({bgColor:CColor('Indigo',10)});
        //Add Design.
        builder.addDesign('header-button',{active: { bgColor:CColor('Gray',17) }  });
        builder.create('Button','header-button-create-app')
            .design('#designs.header-button')
            .icon('plus37',38,'',CColor('White')).link('create-app');
        builder.create('Button','header-button-back')
            .design('#designs.header-button')
            .icon('left46',34,'',CColor('White')).backButton();
        builder.create('Footer','footer').child('footer-message')
            .design({bgColor:{color:'Indigo',level:10}});
        builder.create('Label','footer-message').text('By Codletech')
            .design({color:CColor('White'),textAlign:'center',fontWeight:'normal'});
        builder.create('Content','content')
            .child('page-main').child('page-create-application')
            .child('page-update-application');
        this.createPageMain(builder);
        this.createPageCreateApp(builder);
        this.createPageUpdateApp(builder);

        BBuildGenerator.data = builder.build();
        CAppUpdater.saveApp(BBuildGenerator.data);
    },
    createPageMain: function (builder) {
        // Main Page
        builder.create('Page', 'page-main')
            .page('', 'Application Builder', function () {
            } /* Optional On Page Load */)
            .child('page-main-button-create-app')
            .child('page-main-button-update-app');
        builder.addDesign('main-button',
            {   textAlign: 'left', fontWeight: 'normal',
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
            .icon('arrow556', 40, 'right', CColor('White'))
            .design({parents: ['main-button'], bgColor: CColor('DeepOrange', 12)});
    },
    createPageUpdateApp: function (builder) {
        // Update Application
        builder.create('Page', 'page-update-application')
            .page('update-app', 'Update Application')
            .child('page-update-app-form')
            .child('page-update-app-send-response');
        builder.create('Form', 'page-update-app-form')
            .formInputs(['page-update-app-form-input-id', 'page-update-app-form-input-data'])
            .formSaveToUrl(BAppsHandler.updateAppURL)
            .formSaveToUrlCallback(function (responseData) {
                responseData = responseData || {};
                var label = CObjectsHandler.object('page-update-app-send-response');
                label.setText('Created App ID: ' + responseData._id || 'none' + ' - Keep it!');
                label.rebuild();
            })
            .childs(['page-update-app-form-input-id', 'page-update-app-form-input-data',
                'page-update-app-form-send-to-url-button', 'page-update-app-form--clear-button'])
            .design({ widthXS: 10, padding: 5, marginTop: 10 });
        //Add Design.
        builder.addDesign('text-input',
            {   textAlign: 'left', fontWeight: 'normal', fontSize: 18,
                widthSM: 5, widthXS: 11, height: 42, boxSizing: 'borderBox',
                marginTop: 6, marginLeft: 1, marginRight: 1
            });
        builder.create('Input', 'page-update-app-form-input-id')
            .inputName('appName')
            .inputPlaceholder('Enter Application Name')
            .design('#designs.text-input');
        builder.create('Input', 'page-update-app-form-input-data')
            .inputName('appURI')
            .inputPlaceholder('Enter Application URI')
            .design('#designs.text-input');
        //Add Design.
        builder.create('Button', 'page-update-app-form-send-to-url-button')
            .design({parents: ['main-button'], bgColor: CColor('Teal', 12)})
            .text('Create Application').icon('right43', 40, 'right', CColor('White'))
            .formSendToUrlButton('page-update-app-form');
        builder.create('Button', 'page-update-app-form--clear-button')
            .design({parents: ['main-button'], bgColor: CColor('Red', 12)})
            .text('Clear').icon('right43', 40, 'right', CColor('White'))
            .formClearButton('page-update-app-form');
        builder.create('Label', 'page-update-app-send-response')
            .design({parents: ['main-button'], selectable: true, widthXS: 12, color: CColor('Indigo', 10), bgColor: CColor('White', 12)})
            .text('Created App ID');
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
                var label = CObjectsHandler.object('page-create-app-send-response');
                label.setText('Created App ID: ' + responseData._id || 'none' + ' - Keep it!');
                label.rebuild();
            })
            .childs(['page-create-app-form-input-name', 'page-create-app-form-input-uri',
                'page-create-app-form-send-to-url-button', 'page-create-app-form--clear-button'])
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
            .design('#designs.text-input');
        builder.create('Input', 'page-create-app-form-input-uri')
            .inputName('appURI')
            .inputPlaceholder('Enter Application URI')
            .design('#designs.text-input');
        //Add Design.
        builder.create('Button', 'page-create-app-form-send-to-url-button')
            .design({parents: ['main-button'], bgColor: CColor('Teal', 12)})
            .text('Create Application').icon('right43', 40, 'right', CColor('White'))
            .formSendToUrlButton('page-create-app-form');
        builder.create('Button', 'page-create-app-form--clear-button')
            .design({parents: ['main-button'], bgColor: CColor('Red', 12)})
            .text('Clear').icon('right43', 40, 'right', CColor('White'))
            .formClearButton('page-create-app-form');
        builder.create('Label', 'page-create-app-send-response')
            .design({parents: ['main-button'], selectable: true, widthXS: 12, color: CColor('Indigo', 10), bgColor: CColor('White', 12)})
            .text('Created App ID');
    },

});

BBuildGenerator.build();


