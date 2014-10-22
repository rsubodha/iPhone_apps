/// <reference path='jquery.js' />
/// <reference path='jquerymobile.js' />

/** Set currently focused input to have the specified value (usually called from the native application)
* This currently must be outside of the AppNotch.Mobile namespace as the current binaries expect it to be at the root
* level
* It's now not used since we don't try to display the native picker using the native:// scheme
*/
function an_updateFocusInput(inStr) {
    var elem = document.activeElement;
    if (!elem) {
        AppNotch.Mobile.anConsole.error('updateFocusInput called but document.activeElement is not set');
        return;
    }
    if (!elem.type) {
        AppNotch.Mobile.anConsole.error('updateFocusInput called but document.activeElement has no type attribute and likely not an input element');
        var tagData = '<' + elem.tagName.toLowerCase() + ' ';
        for (var i = 0; i < elem.attributes.length; i++) {
            var attr = elem.attributes.item(i);
            if (attr.specified)
                tagData = tagData + attr.name + '="' + attr.value + '" ';
        }
        tagData = tagData + '>';
        AppNotch.Mobile.anConsole.error(tagData);
        return;
    }
    elem.value = inStr;
    elem.blur();
}

function goBack(el) {
    page = $(el).closest('[data-role=page]').siblings('[data-role=page]:first');
    $.mobile.changePage(page, { transition: 'fade' })
}

var isDesign = false;

var AppNotch = AppNotch || {};

AppNotch.Mobile =
(function () {

    var viewerUrl = 'http://www.mobiwebmix.com/';
    var timeOut = 30000; //milliseconds

    var myParent = window;
    var isIframed = false;

    if (window.top != window.self) {
        isIframed = true;
    }

    try {
        var test = parent.location.href;
        myParent = parent;
    }
    catch (e) {
        myParent = window;
    }

    var AN_CALLBACK_BASE = myParent.location.protocol + '//' + myParent.location.hostname + '/'; //Use current server as base
    if (myParent.location.protocol.indexOf('http') == -1) {
        //Set callback to production if the protocol isn't http: (aka on a device it would be file:)
        AN_CALLBACK_BASE = 'http://www.appnotch.com/';
    }


    var anConsole = window.console;
    //console is not defined in all browsers, namely the iOS webview
    if (!anConsole) {
        //create a dummy console object that does nothing, otherwise they would throw errors
        anConsole = {
            log: function () { },
            warn: function () { },
            error: function () { },
            debug: function () { },
            dir: function () { },
            groupCollapsed: function () { },
            groupEnd: function () { }
        };
    }

    //If we aren't in preview mode some of the functions used won't be defined, instead we should try to log the issue
    var PageTryLoad = window.PageTryLoad;
    if (!PageTryLoad) {
        PageTryLoad = function () {
            anConsole.error('PageTryLoad was called, but it is not defined for the window (We are not in preview mode)');
            return false;
        };
    }

    //Determine if browser supports HTML 5 input types with UI, only date and time are currently used
    //Modified from http://nicolahibbert.com/html5-forms-support-detection-javascript/
    var AN_UI_SUPPORT = [];

    (function () {
        AN_UI_SUPPORT = [];
        var inputTypes = ['url', 'email', 'datetime', 'date', 'time', 'month', 'week', 'datetime-local', 'number', 'color', 'range'];

        for (var i = 0; i < inputTypes.length; i++) {
            var inp = document.createElement('input');
            inp.setAttribute('type', inputTypes[i]);
            var notText = inp.type !== 'text';
            if (notText) {
                inp.value = 'bogus';
                if (inp.value !== 'bogus')
                    AN_UI_SUPPORT.push(inp.type);
            }
        }
    })();

    /* Debugger
    --------------------------------------------------*/
    function lastPath(d) {
        var res = d.split('/');
        return res[res.length - 1];
    }

    $(function () {

        // Load the secured page.    
        LoadSecPage('body');
        checkForLogin();

        /* Popup Start */

        $('.ui-page').click(function (event) {
            var caller = event.target.id;
            var pop = $('.ui-page-active #popup');
            //alert(caller);

            if (caller != 'popup') {
                pop.fadeOut('fast');
            }
        });

        /* Popup End */

        isDesign = $('body').attr('an-design');

        if (isDesign == null || isDesign == undefined)
            isDesign = false;

        if (isDesign) {
            //Wire up page loading errors to the send error callback
            $('document').on('pagecontainerchangefailed', function (event, data) {
                var pageName = (data.toPage.jquery ? 'Previously Loaded Page' : data.toPage);
                anConsole.error('pagecontainerchangefailed - error changing page: ' + pageName);
                //Check if we have a parent with the function we need
                if (myParent.AppNotch && myParent.AppNotch.ErrorHandlers && myParent.AppNotch.ErrorHandlers.sendErrorMsg) {
                    myParent.AppNotch.ErrorHandlers.sendErrorMsg("JQuery Mobile error loading page: " + pageName + "\n")
                }
            });
        }

        $('document').on('pagecontainerloadfailed', function (event, ui) {
            anConsole.error('Error loading page: ' + lastPath(ui.url) + ' - ' + ui.textStatus + ' - ' + ui.errorThrown);
        });

        //anConsole.log('Document ready func called: ' + lastPath(document.location.href));
        $(document).on('pagecontainershow', function (event, ui) {
            /*anConsole.log('pagecontainershow - ui.prevPage:' + JSON.stringify(ui.prevPage));
            if (ui.nextPage && ui.nextPage.attr('id').indexOf('prevPage') == -1) {
            anConsole.log('pagecontainershow - nextPage:' + JSON.stringify(ui.nextPage));
            }
            */
            if (!isDesign) {
                $(document).find('div[an-data-role="text"] div').removeClass('ui-state-disabled');
                $(document).find('input, textarea').removeAttr('disabled');
                LoadDynamicControls();
            }

            ConsumeRss(isDesign);
            LoadShop(isDesign);

            showFirstSocialMedia();
            fbWallInit();
            instagramInit();

            chatInit(isDesign);
            mapInit();
            galleryInit();
            calendarInit();
            ChickletAnimation();
            checkForLogin();
            showFirstSocialMedia();
            YoutubeChannelInit();
            CarousalImageSlider();
            initializeDynamicMap();
            LoadSignature();

        });

        var networkBusy = false;

        var EMAIL_REG = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        $(document).on('click', 'div.an-email-sender .an-email-btnSend', function () {
            if (networkBusy) return;
            //ClassNames got backward, so I switched the variables for now
            var t = $(this).closest('div[an-ctrl=true]');
            var senderName = t.find('.an-email-name').val();
            var fromInfo = t.find('.an-email-from').val();
            var toInfo = t.find('.an-email-to').val();
            var subjectInfo = t.find('.an-email-subject').val();
            var bodyInfo = t.find('.an-email-body').val();
            var url = AN_CALLBACK_BASE + 'web/callback/EmailSubmit.aspx';

            var emailStatus = t.find('.an-email-status');

            if (EMAIL_REG.test(toInfo) && EMAIL_REG.test(fromInfo)) {
                $.mobile.loading('show');
                networkBusy = true;
                $.ajax({
                    type: 'POST',
                    url: url,
                    dataType: 'Text',
                    data: {
                        'name': senderName,
                        'fromInfo': fromInfo,
                        'toInfo': toInfo,
                        'subjectInfo': subjectInfo,
                        'bodyInfo': bodyInfo
                    },
                    success: function (msg) {
                        if (msg == 'success') {
                            emailStatus.removeClass('error');
                            emailStatus.addClass('success');
                            emailStatus.html('You have successfully sent an email.');
                            t.find('.an-email-btnSend').attr('disabled', true);
                        } else {
                            emailStatus.removeClass('success');
                            emailStatus.addClass('error');
                            emailStatus.html('An error occurred: ' + msg);
                        }

                        emailStatus.fadeOut(3000);
                        $.mobile.loading('hide');
                        networkBusy = false;
                    },
                    error: function (jqXHR) {

                        emailStatus.removeClass('success');
                        emailStatus.addClass('error');
                        emailStatus.html('A server error occurred. Please contact support if the problem persists.');
                        emailStatus.fadeOut(3000);

                        $.mobile.loading('hide');
                        networkBusy = false;
                    }
                });
            }
            else {
                $.mobile.loading('hide');
                emailStatus.addClass('error');
                emailStatus.html('Please enter a valid email address.');

                emailStatus.stop().fadeIn(1000, function () {
                    emailStatus.fadeOut(3000);
                });
            }

        });

        $(document).on('click', 'div[an-data-role="appointment"] input.an-appt-btn', function () {
            if (networkBusy) return;
            var $t = $(this).closest('div[an-data-role="appointment"]');
            var title = $t.find('.an-appt-title').val();
            var desc = $t.find('.an-appt-desc').val();
            var startDate = $t.find('.an-appt-strtdate').val();
            var startTime = $t.find('.an-appt-strttime').val();
            var endDate = $t.find('.an-appt-enddate').val();
            var endTime = $t.find('.an-appt-endtime').val();
            var calId = $t.find('.an-appt-calId').val();

            if (!calId) return; //No calendar to post to... maybe show a message?

            if (!title) {
                AN_PopupMessage($t, 'Error', 'Please enter a title');
                return;
            }
            if (!desc) {
                AN_PopupMessage($t, 'Error', 'Please enter a description');
                return;
            }
            if (!startDate) {
                AN_PopupMessage($t, 'Error', 'Please enter a Start Date');
                return;
            }
            if (!startTime) {
                AN_PopupMessage($t, 'Error', 'Please enter a Start Time');
                return;
            }
            if (!endDate) {
                AN_PopupMessage($t, 'Error', 'Please enter an End Date');
                return;
            }
            if (!endTime) {
                AN_PopupMessage($t, 'Error', 'Please enter an End Time');
                return;
            }

            var sDateTime = new Date(startDate + " " + startTime);
            var eDateTime = new Date(endDate + " " + endTime);

            if (isNaN(sDateTime)) //Probably on Safari that doesn't like -'s in the date
                sDateTime = new Date(startDate.replace(/-/g, '/') + " " + startTime);

            if (isNaN(eDateTime))
                eDateTime = new Date(endDate.replace(/-/g, '/') + " " + endTime);

            if (sDateTime > eDateTime) {
                AN_PopupMessage($t, 'Error', 'Start date must be before End date');
                return;
            }

            $.mobile.loading('show');
            networkBusy = true;
            $.ajax({
                type: 'POST',
                url: AN_CALLBACK_BASE + 'cms/EventAdmin/common/AddEvent.ashx?calId=' + calId,
                data: {
                    'an-title': title,
                    'an-desc': desc,
                    'an-aptStartApt': sDateTime.toUTCString(),
                    'an-aptEndApt': eDateTime.toUTCString()
                }
            })
            .done(function (msg) {
                if (msg != 'success')
                    AN_PopupMessage($t, 'Error', msg);
                else
                    AN_PopupMessage($t, 'Success', 'Successfully added appointment', 3000);
            })
            .fail(function () {
                AN_PopupMessage($t, 'Error', 'A network or server error occurred. Try again later.');
            })
            .always(function () {
                $.mobile.loading('hide');
                networkBusy = false;
            });


        });

        $(document).on('click', '[an-chat=send]', function () {
            if (networkBusy) return;
            var n = $(this).closest('table').find('#txtName').val();
            var m = $(this).closest('table').find('#txtMessage').val();
            var t = $(this).closest('[an-data-role=chat]').attr('an-data-log');
            var b = $(this).closest('[an-data-role=chat]').attr('an-data-book');
            var tm = new Date().toUTCString();
            var el = this;

            var $this = $(this);

            if (m == '' || !m || n == '' || !n)
                return;

            $.mobile.loading('show', {
                text: 'Posting new message...',
                textVisible: true
            });

            networkBusy = true;
            $.ajax({
                url: AN_CALLBACK_BASE + 'cms/apiadmin/callback/chat/InsertRecord.aspx',
                data: { name: n, msg: m, tName: t, bName: b, time: tm },
                type: 'POST',
                timeout: timeOut,
                success: function (msg) {
                    $(el).closest('table').find('#txtMessage').val('');

                    if (msg != '' && msg != undefined && msg != null) {
                        AN_PopupMessage($this, 'Error', msg);
                    }
                },
                error: function (e) {
                    if (e.statusText == 'timeout')
                        AN_PopupMessage($this, "Login Failed.", 'Server timed out.');
                    else
                        AN_PopupMessage($this, "Login Failed.", 'Cannot connect to server.');
                }
            })
            .always(function () {
                $.mobile.loading('hide');
                networkBusy = false;
            });

        });

        $(document).on('click', '[an-action=RegisterHandler]', function () {
            register($(this).closest('[data-role=register]'));
        });

        $(document).on('click', '[an-action=LoginHandler]', function () {
            var container = $(this).closest('[data-role=login]');
            if (container[0] == undefined) {
                container = $(this).closest('[an-code]');
            }

            login(container, $(this).attr('an-type'));
        });

        $(document).on('click', '[an-action=forgotPass]', function () {
            if (networkBusy) return;
            var mail = $('#email').val();
            var code = $('#email').attr('appcode');
            var tName = $('#email').attr('table');

            if (!ValidateEmail(mail) || mail == '') {

                AN_PopupMessage(this, 'Error', 'Invalid Email Address.');

                return
            }

            var $this = $(this);

            $.mobile.loading('show', {
                text: 'Loading please wait...',
                textVisible: true
            });
            networkBusy = true;
            $.ajax({
                url: AN_CALLBACK_BASE + 'cms/apiadmin/callback/auth/forgotPass.aspx',
                data: { email: mail, appcode: code, tName: tName },
                type: 'POST',
                timeout: timeOut,
                success: function (msg) {
                    msg = msg.split(':');
                    AN_PopupMessage($this, '', msg[1]);
                },
                error: function (msg, e, x) {

                    x = x.split(':');
                    if (e.statusText == 'timeout')
                        AN_PopupMessage($this, "", 'Server timed out.');
                    else
                        AN_PopupMessage($this, '', x[1]);

                }
            })
            .always(function () {
                $.mobile.loading('hide');
                networkBusy = false;
            });

        });

        $(document).on('click', '[an-action=changePass]', function () {
            if (networkBusy) return;
            var mail = $('#email').val();
            var oldPass = $('#password').val();
            var newPass = $('#newpassword').val();
            var confPass = $('#confnewpassword').val();
            var code = $('#email').attr('appcode');
            var tName = $('#email').attr('table');
            var errorMsg = '';

            if (!ValidateEmail(mail) || mail == '')
                errorMsg += 'Please enter a valid email. <br/>';

            if (oldPass == '')
                errorMsg += 'Please enter your old password. <br/>';

            if (newPass == '')
                errorMsg += 'Please enter your new password. <br/>';

            if (newPass != confPass)
                errorMsg += 'Your new and confirmation password did not match. <br/>';

            if (errorMsg != '') {
                AN_PopupMessage(this, '', errorMsg);
                return;
            }

            var $this = $(this);

            $.mobile.loading('show', {
                text: 'Loading please wait...',
                textVisible: true
            });
            networkBusy = true;
            $.ajax({
                url: AN_CALLBACK_BASE + 'cms/apiadmin/callback/auth/changePass.aspx',
                data: { email: mail, pwd: newPass, opwd: oldPass, cpwd: confPass, appcode: code, tName: tName },
                type: 'POST',
                dataType: 'html',
                timeout: timeOut,
                success: function (msg) {
                    msg = msg.split(':');
                    AN_PopupMessage($this, '', msg[1]);
                    if (msg[0] == 'success') {
                        $(this).remove();
                        $('#email').val('');
                        $('#password').val('');
                        $('#newpassword').val('');
                        $('#confnewpassword').val('');
                    }
                },
                error: function (msg, e, x) {
                    x = x.split(':');
                    if (e.statusText == 'timeout')
                        AN_PopupMessage($this, "", 'Server timed out.');
                    else
                        AN_PopupMessage($this, '', x[1]);

                }
            })
            .always(function () {
                $.mobile.loading('hide');
                networkBusy = false;
            });

        });

        $(document).on('click', '[an-action=register]', function () {
            var container = $(this).closest('[data-role=popups]');

            if (container[0] == undefined) {
                container = $(this).closest('[an-code]');
            }

            var code = container.attr('an-code');
            var table = container.attr('an-data-log')
            var redirectTo = container.attr('an-redirect-url');

            $('#sec-register[data-role="page"]').remove();

            $.ajax({
                url: AN_CALLBACK_BASE + "web/api/registration.txt",
                type: 'GET',
                dataType: 'TEXT',
                success: function (e) {
                    e = $(e).attr('id', "sec-register");
                    $(e.find('#dvAppContainer')).attr('an-code', code);
                    $(e.find('#dvAppContainer')).attr('an-log', table);
                    $(e.find('#dvAppContainer')).attr('an-redirect-url', redirectTo);

                    var isHome = window.location.href;


                    $('body').append(e);

                    if (isHome.indexOf('home.html') != -1)
                        $.mobile.changePage('#sec-register');
                    else
                        $.mobile.changePage($('#sec-register'));

                    $.mobile.loading('hide');
                }
            });

        });

        $(document).on('click', '.ui-clickable', function (event, ui) {

            var params = $(this).attr('target').split(';');
            var defValue = params[0];
            var clckValue = params[1];

            change(this, defValue, clckValue);

        });

        $(document).on('click', '[an-data-role=dynamic] input[type=button]', function (event, ui) {
            getDirection(this);
        });

        $(document).on('pageshow', 'div', function (e, ui) {
            //doLog('pageshow - div');
            CheckPopupSizeAndLoc();
            LoadSecPage(e.target);

            var otherClass = '.ui-grid-a, .ui-grid-b, .ui-grid-c';
            if ($('[an-data-role=socialmedia]').find(otherClass)[0])
                $('[an-data-role=socialmedia]').find(otherClass).removeClass('ui-grid-d');
            else
                $('[an-data-role=socialmedia]').find('ul').addClass('ui-grid-d');
        });

        $(document).on('pagebeforeshow', 'div', function (e, u) {

            //anConsole.log('pagebeforeshow - div baseURI:' + lastPath(e.target.baseURI));
            $(e.target).find('[an-data=secured]').hide();

            var otherClass = '.ui-grid-a, .ui-grid-b, .ui-grid-c';
            if ($('[an-data-role=socialmedia]').find(otherClass)[0])
                $('[an-data-role=socialmedia]').find(otherClass).removeClass('ui-grid-d');
            else
                $('[an-data-role=socialmedia]').find('ul').addClass('ui-grid-d');
        });

        $(document).on('pagehide', 'div', function (event, ui) {
            var isNative = $('body').attr('an-convtype');
            //anConsole.log('pagehide - div isNative:' + isNative);
            if (isNative == 'xml') {
                if (event.delegateTarget.baseURI)
                    document.location = 'native://seclabs.com/pageLoad/' + event.delegateTarget.baseURI;
            }

        });

        $(document).on('click', '[an-action=socialMedialTab]', function () {
            // VALUES FOR THE TAB CHANGE
            var mode = $(this).attr('an-value');
            showHideFacebookTweeter(this, mode);
        });

        $(document).on('click', 'div[an-data-role="camera"] input[type="button"]', function (event, ui) {
            if (!window.cordova) {
                alert("The Camera control requires running in a PhoneGap/Cordova application");
                return;
            }

            if (!navigator.camera) {
                alert("Could not get navigator.camera object, ensure PhoneGap/Cordova is set up correctly.");
                return;
            }

            var $t = $(this);
            navigator.camera.getPicture(
            //Success callback
            function (uri) {
                var ele = $t.closest('div[an-data-role="camera"]').find('div[an-camera-img="true"]').first();
                ele.empty();
                ele.append('<img src="' + uri + '" style="width:100%;">');
            },
            //Error Callback
            function (msg) {
                alert("Camera Error: " + msg);
            },
            //Options
            {
                destinationType: Camera.DestinationType.NATIVE_URL
            });
        });

        showFirstSocialMedia();
        fbWallInit();
        instagramInit();

        ChickletAnimation();
        ConsumeRss(isDesign);
        LoadShop(isDesign);
        mapInit();
        galleryInit();
        calendarInit();
        ChickletAnimation();
        changeFormSubmit();
        chatInit(false);
        CarousalImageSlider();
        checkSSO();
        YoutubeChannelInit();
        initializeDynamicMap();
        LoadSignature();

        if (!isDesign)
            LoadDynamicControls();
    });

    $(window).resize(function () {
        CheckPopupSizeAndLoc();
        changeGridViews();
    });

    /* Generic
    --------------------------------------------------*/

    function ChickletAnimation() {

        $('.an-chick').hover(function () {
            $(this).find('img').stop().fadeTo('fast', 0.3);
        }, function () {
            $(this).find('img').stop().fadeTo('fast', 1.0);
        });

        $('.an-chick').click(function () {
            $(this).find('img').stop().fadeTo('fast', 2.0);
        }, function () {
            $(this).find('img').stop().fadeTo('fast', 1.0);
        });

    }

    function changeGridViews() {

        if ($('.hdnAutoWrap').val() != undefined && $('.hdnAutoWrap').val() != null) {
            var orientation = window.orientation;
            var autoWrap = $('.hdnAutoWrap').val().toLowerCase();
            var width = $(window).width();
            var height = $(window).height();

            if (orientation == 0) {
                //alert(orientation);
                $('.grid-item').each(function () {
                    $(this).removeClass('grid-width_importants_4');
                });
            }
            else if (orientation == 90) {
                view = 'Landscape CounterClockwise';

                if (autoWrap == true) {
                    $('.grid-item').each(function () {
                        if ((this).hasClass('grid-width_importants_4') == false) {
                            $(this).addClass('grid-width_importants_4');
                        }
                    });
                }
            }
            else if (orientation == -90) {
                view = 'Landscape Clockwise';

                if (autoWrap == true) {
                    $('.grid-item').each(function () {
                        if ((this).hasClass('grid-width_importants_4') == false) {
                            $(this).addClass('grid-width_importants_4');
                        }
                    });
                }
            }
            else {
                //alert('x');
                view = ' View Orientation is not supported';
                orientation = ' View Orientation is not supported';
            }


            if (autoWrap == true) {
                if (width > height) {
                    $('.grid-item').each(function () {
                        if ((this).hasClass('grid-width_importants_4') == false) {
                            $(this).addClass('grid-width_importants_4');
                        }
                    });
                }
                else {
                    $('.grid-item').each(function () {
                        $(this).removeClass('grid-width_importants_4');
                    });
                }
            }
        }
    }

    function callPopUp() {
        var isEnabled = $('.ui-page-active #hdnPopupEnabled').val();
        if (isEnabled == 'true') {
            var pop = $('.ui-page-active .popup');
            $('.ui-page-active #popup').show();
            $('.ui-page-active #popup').addClass('visible');
        }

    }

    function change(obj, def, clck) {

        $(obj).css(def)
        $(obj).mouseup(function () {
            $(obj).css(clck)
        });
    }

    function CheckPopupSizeAndLoc() {
        var platform = navigator.platform;

        var pop = $('.ui-page-active #popup');
        var width = $(window).width();
        var height = $(window).height();

        if (platform == 'iPad') {
            pop.addClass('BigScreenText');
        }

        pop.width(width / 2);
        pop.height(height / 2);
    }

    /* Gallery Image loader */
    function GalleryLoaderPreview(ele) {
        if (isDesign) {
            $('[an-data-role=gallery] img.loading').hide();
            $('[an-data-role=gallery] img.original').show();
            $('[an-data-role=imageslider] img.loading').hide();
            $('[an-data-role=imageslider] img.original').show();
            $('[an-data-role=image] img.loading').hide();
            $('[an-data-role=image] img.original').show();
        }
        else {
            // $(ele);
            $(ele).show().siblings('.original').hide();
            $(ele).siblings('.original').load(function () {
                $(ele).fadeOut('fast', function () {
                    $(ele).siblings('.original').fadeIn('fast');
                });
            }).error(function () {
                var url = '';
                $(ele).attr('src', '/apps/global/image/helpquestion.png');
                $(ele).attr('onload', '');
            });
        }
    }

    /* Static Map
    --------------------------------------------------*/
    function mapStaticInit() {

        if (!window.google)
            return;

        var lat;
        var lng;
        var geocoder = new google.maps.Geocoder();
        var sUrl = 'http://maps.googleapis.com/maps/api/staticmap?center=';
        address = $('.FromAddress').text();

        var loc = address = address.toString().replace(/ /g, '+');

        geocoder.geocode({ 'address': address }, function (result, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                lat = result[0].geometry.location.lat().toString();
                lng = result[0].geometry.location.lng().toString();

                sUrl += loc;
                sUrl += '&zoom=18&size=800x800&maptype=roadmap&markers=color:red%7C' + lat + ',' + lng + '&sensor=false';
                //alert(sUrl);
                $('.static-map').attr('src', sUrl);
            }
            else {
                //alert('error: ' + status);
            }
        });

        $(geocoder).remove();
    }

    /* Google Map Code
    --------------------------------------------------*/

    function mapInit() {

        if (!window.google)
            return;

        var geocoder = new google.maps.Geocoder();
        $('.map-dynamic').each(function () {
            InitMapDirection(this, geocoder);
        })
    }

    function InitMapDirection(elm, geocoder) {
        var lat;
        var lng;
        var address = $(elm).find(".dynamic-ToAddress").text();
        var canvas = $(elm);
        anConsole.log(canvas.find('.canvas').length);

        if (canvas.find('.canvas').length > 0) {
            geocoder.geocode({ 'address': address }, function (result, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    lat = result[0].geometry.location.lat().toString();
                    lng = result[0].geometry.location.lng().toString();
                    canvas.closest('[an-data-role=dynamic]').attr('lat', lat).attr('lng', lng);
                    DrawMap(canvas.find('.canvas')[0], lat, lng, address);
                }
            });
        }
    }

    function DrawMap(canvas, lat, lng, address) {
        var loc;

        var myGmaps = $.extend(google.maps, {});
        directionDisplay = new google.maps.DirectionsRenderer();
        loc = new google.maps.LatLng(lat, lng);

        var myOptions = {
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: loc
        };


        var mapScr = new myGmaps.Map(canvas, myOptions);
        var marker = new google.maps.Marker({
            position: loc,
            title: address,
            map: mapScr
        });

        directionDisplay.setMap(mapScr);
    }

    function getDirection(el) {

        var container = $(el).closest('[an-data-role=dynamic]')
        var end = $(container).find('.dynamic-ToAddress').text();
        var start = $(container).find('.dynamic-FromAddress').val();
        var canvas = $(container).find('.canvas')[0];
        var lat = $(container).attr('lat');
        var lng = $(container).attr('lng');

        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };

        var myGmaps = $.extend(google.maps, {});
        var directionsService = new google.maps.DirectionsService();

        loc = new google.maps.LatLng(lat, lng);
        var myOptions = {
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: loc
        };
        var mapScr = new myGmaps.Map(canvas, myOptions);
        directionDisplay = new google.maps.DirectionsRenderer();
        directionsService.route(request, function (result, status) {
            if (status == 'OK') {
                directionDisplay.setMap(mapScr);
                directionDisplay.setDirections(result);
            }
            else
                alert('There was a problem getting directions');

            $.mobile.loading('hide');
        });

    }

    function initializeDynamicMap() {

        if (!window.google)
            return;

        //        MapInitDyn();
        setTimeout(function () {
            MapInitDyn();
        }, 2000);
    }
    function MapInitDyn() {
        $('.map-canvas').each(function (index, elm) {
            var parElm = $(elm).closest('[an-data-role]');
            var spn = $(parElm).find('span.testScript')[0];
            var spnData = $(spn).text();
            if ($.trim(spnData) != '') {
                var mapDataTemp = JSON.parse(spnData);
                var geocoder = new google.maps.Geocoder();
                if (mapDataTemp.markers.length > 0) {
                    geocoder.geocode({ 'address': mapDataTemp.markers[0].Text }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            var mapOptions = {
                                zoom: mapDataTemp.zoom,
                                center: results[0].geometry.location
                            };
                            //var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                            var map = new google.maps.Map(elm, mapOptions);
                            loadLocations(map, mapDataTemp.markers);
                        }
                    });
                }
                else {
                    LoadDefaultMapDynamic(elm, mapDataTemp.zoom);
                }
            }
            else {
                LoadDefaultMapDynamic(elm, 6);
            }
        });
    }
    function LoadDefaultMapDynamic(elm, zoom) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': 'Missouri' }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var mapOptions = {
                    zoom: zoom,
                    center: results[0].geometry.location
                };
                var map = new google.maps.Map(elm, mapOptions);
            }
        });
    }
    function loadMarker(map, markerLocation, data) {
        var marker = new google.maps.Marker({
            position: markerLocation,
            animation: google.maps.Animation.DROP,
            map: map,
            title: data['title'],
            url: data['url'],
            customInfo: data
        });
        google.maps.event.addListener(marker, 'click', function () {
            if (marker['customInfo'].lType == 'int') {
                var pid = "#prevPage" + marker['customInfo'].url;
                var trans = marker['customInfo'].Animation == '' ? 'slidedown' : marker['customInfo'].Animation;
                //  console.log(PageTryLoad(pid, { transition: trans }));
                if (PageTryLoad && PageTryLoad(pid, { transition: trans }))
                { }
                else
                    $.mobile.changePage(marker['customInfo'].url + ".html", { transition: trans });

            }
            else {
                anConsole.log("loadMarker - marker['customInfo'].lType is not 'int' (internal link)");
                window.location.href = marker.url;
            }
        });
    }

    function loadLocations(map, markers) {
        for (var i = 0, len = markers.length; i < len; i++) {
            GetGeocode(map, markers[i].Text, {
                'title': markers[i].Text, 'url': markers[i].Value,
                'lType': markers[i].lType, 'animation': markers[i].Animation
            }, loadMarker);
        }
    }
    function GetGeocode(map, address, data, callback) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                callback(map, results[0].geometry.location, data);
            }
        });
    }

    /* RSS Code
    --------------------------------------------------*/
    function ConsumeRss(isDesign) {
        if (isDesign)
            return;

        $('[an-data-role=rss]').each(function () {
            var ele = this;
            var callBack = AN_CALLBACK_BASE + 'web/callback/RssConsumer.aspx?sUrl=';
            var rssUrl = $(this).find('[type=hidden]').val();
            var count = $(this).find('[type=hidden]').attr('maxItem');
            var bkgColor = $(this).find('[type=hidden]').attr('an-bkg-color');
            var fontColor = $(this).find('[type=hidden]').attr('an-font-color');
            var tabFontColor = $(this).find('[type=hidden]').attr('an-tab-font-color');
            var tabBkgColor = $(this).find('[type=hidden]').attr('an-tab-bkg-color');
            var newWindow = $(this).attr('an-new-window');

            rssUrl = rssUrl.replace('&', '|');

            $.ajax({
                url: callBack + rssUrl,
                type: 'POST',
                dataType: 'json',
                global: false,
                contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    GenerateRssView(ele, result, parseInt(count) + 1, isDesign, newWindow, bkgColor, fontColor, tabFontColor, tabBkgColor);
                    $('[an-data-role=rss] li:not(:first):not([data-role=list-divider]) > a').css({ 'border': "" });
                },
                error: function (result) {
                    if (result.status == 200 && result.statusText == 'parseerror' || result.responseText == 'True') {
                        GenerateRssView(ele, result, parseInt(count) + 1, isDesign);
                    }
                }
            });

        });

    }
    function GenerateRssView(ele, result, maxItem, isDesign, newWindow, bkgColor, fontColor, tabFontColor, tabBkgColor) {
        var ulView = $(ele).find('ul');
        var itemNum = $(ele).find('input[type=hidden]').attr('itemNumber');
        var display = $(ele).find('input[type=hidden]').attr('display');
        var iCount = 0;

        if (display == null || display == undefined)
            display = '0';

        $(ulView).html('');
        for (p in result) {
            if (iCount != maxItem) {
                if (result[p] != null && result[p] != undefined) {
                    if (iCount == 0) {
                        var headLi = $('<li/>').attr('data-role', 'list-divider')
                                               .html(result[p].Title);
                        $(ulView).append(headLi);
                    }
                    else {
                        var aLink = null;

                        switch (display) {
                            case '0':
                                {
                                    aLink = RssViewFlat(result[p], isDesign, bkgColor, fontColor);
                                    break;
                                }
                            case '1':
                                {
                                    aLink = RssViewSmallImage(result[p], isDesign, bkgColor, fontColor);
                                    break;
                                }
                            case '2':
                                {
                                    aLink = RssViewBigImage(result[p], isDesign, bkgColor, fontColor);
                                    break;
                                }
                        }

                        if (newWindow == 'true' || isIframed) {
                            aLink = $(aLink).attr('target', '_blank')
                                                .attr('rel', 'external');
                        }

                        var rssLi = $('<li>').append(aLink);
                        $(ulView).append(rssLi);
                    }
                    ++iCount;
                }
            }
            else {
                break;
            }
        }

        var tabStyle = '';
        if (tabBkgColor != null && tabBkgColor != undefined && tabBkgColor != '')
            tabStyle += 'text-shadow: none; background: -moz-linear-gradient(#' + tabBkgColor + ',#' + tabBkgColor + ') repeat scroll 0 0 #' + tabBkgColor + '; border-color: #' + tabBkgColor + '; background-image:-webkit-linear-gradient(#' + tabBkgColor + ',#' + tabBkgColor + ');';

        if (tabFontColor != null && tabFontColor != undefined && tabFontColor != '')
            tabStyle += 'color: #' + tabFontColor;

        $(ulView).listview('refresh');
        $(ulView).find('li:first').attr('style', tabStyle);

    }
    function RssViewFlat(result, isDesign, bkgColor, fontColor) {

        var style = '';

        if (bkgColor != null && bkgColor != undefined && bkgColor != '')
            style += 'background: -moz-linear-gradient(#' + bkgColor + ',#' + bkgColor + ') repeat scroll 0 0 #' + bkgColor + '; border-color: #' + bkgColor + '; background-image:-webkit-linear-gradient(#' + bkgColor + ',#' + bkgColor + '); text-shadow: none;';

        var aLink = $('<a/>');
        aLink = aLink.html(result.Title);
        aLink.attr('style', style + ' color:#' + fontColor);

        if (isDesign == false) {
            aLink = aLink.attr('href', result.Link)
        }

        return aLink;
    }
    function RssViewSmallImage(result, isDesign, bkgColor, fontColor) {
        var appCode = myParent.$('#hdnAppCode').val();
        var imgTag = result.Image;
        if (imgTag == '')
            imgTag = $('<img src="/apps/' + appCode + '/image/Question_Gray_80x80.png"/>').addClass('ui-li-icon');
        else
            imgTag = $('<img src="' + imgTag + '"/>').addClass('ui-li-icon');

        var aLink = $('<a/>');

        aLink.append(imgTag);
        aLink.append(result.Title);

        var style = '';
        if (bkgColor != null && bkgColor != undefined && bkgColor != '')
            style += 'background: -moz-linear-gradient(#' + bkgColor + ',#' + bkgColor + ') repeat scroll 0 0 #' + bkgColor + '; border-color: #' + bkgColor + '; background-image:-webkit-linear-gradient(#' + bkgColor + ',#' + bkgColor + '); text-shadow: none;';
        aLink.attr('style', style + ' color:#' + fontColor);

        if (isDesign == false) {
            aLink.attr('href', result.Link);
        }

        return aLink;
    }
    function RssViewBigImage(result, isDesign, bkgColor, fontColor) {
        var appCode = myParent.$('#hdnAppCode').val();
        if (appCode == '' || appCode == undefined || appCode == null)
            appCode = '0';

        var desc = result.Description;

        if (desc != null && desc != undefined && desc.length > 20)
            desc = desc.substring(0, 50) + '...';

        var imgTag = result.Image;
        if (imgTag == '')
            imgTag = '<img src="/apps/' + appCode + '/image/Question_Gray_80x80.png"/>';
        else
            imgTag = '<img src="' + imgTag + '"/>';

        var img = $(imgTag);
        var span = $('<span/>').html(result.Title).attr('style', 'margin-bottom: 10px; display: block; padding: 5px 0px;overflow: hidden; text-overflow: ellipsis !important;');
        var p = $('<p/>').html(desc).attr('style', 'margin-top: 5px;');
        var aLink = $('<a/>');

        aLink.append(img);
        aLink.append(span);
        aLink.append(p);

        var style = '';
        if (bkgColor != null && bkgColor != undefined && bkgColor != '')
            style += 'background: -moz-linear-gradient(#' + bkgColor + ',#' + bkgColor + ') repeat scroll 0 0 #' + bkgColor + '; border-color: #' + bkgColor + '; background-image:-webkit-linear-gradient(#' + bkgColor + ',#' + bkgColor + '); text-shadow: none;';
        aLink.attr('style', style + ' color:#' + fontColor);

        if (isDesign == false) {
            aLink.attr('href', result.Link);
        }

        return aLink;
    }

    /* Shop Code
    --------------------------------------------------*/
    function LoadShop() {
        if (isDesign)
            return;

        $('[an-data-role=shopping]').each(function () {

            var ele = this;
            var code = $(ele).attr('an-code');
            var cat = $(ele).attr('an-category');
            var price = $(ele).attr('an-price');
            var isImageVisible = $(ele).attr('an-img');
            var isCollapsible = $(ele).attr('an-collapsible');

            if (isImageVisible == undefined || isImageVisible == null)
                isImageVisible = "true";

            if (price == undefined || price == null)
                price = "true";

            $(ele).find('[role=heading]').html('Loading...');

            var callBack = AN_CALLBACK_BASE + 'cms/apiadmin/callback/shop/GetItems.aspx';
            var bkgColor = $(ele).attr('an-bkg-color');
            var tabBkgColor = $(ele).attr('an-tab-bkg-color');
            var fontColor = $(ele).attr('an-font-color');
            var tabFontColor = $(ele).attr('an-tab-font-color');
            var searchable = $(ele).attr('an-data-filter');

            $.ajax({
                url: callBack,
                data: { appcode: code, category: cat },
                type: 'POST',
                global: false,
                xhrFields: {
                    withCredentials: true
                },
                success: function (result) {
                    var count = result.length

                    if (count > 0) {
                        if (isCollapsible == 'true')
                            LoadShopCollapsible(ele, result, isDesign, code, bkgColor, tabBkgColor, fontColor, tabFontColor, isImageVisible, price, searchable);
                        else
                            LoadShopBigImage(ele, result, isDesign, code, bkgColor, tabBkgColor, fontColor, tabFontColor, isImageVisible, price, searchable);
                    }
                    else {
                        var ulView = $(ele).find('ul');
                        $(ulView).html('<li>There are no item(s) in this shop.</li>');
                        $(ulView).listview('refresh');
                    }
                },
                error: function (result) {
                    if (result.status == 200 && result.statusText == 'parseerror' || result.responseText == 'True') {
                        LoadShopBigImage(ele, result, isDesign);
                    }
                }
            });

        });
    }

    /* Shop Big Image
    --------------------------------------------------*/
    function LoadShopBigImage(el, result, isDesign, code, bkgColor, tabBkgColor, fontColor, tabFontColor, isImageVisible, price, searchable) {
        var ulView = $(el).find('ul');
        style = '';
        tabStyle = '';

        if (bkgColor != null && bkgColor != undefined && bkgColor != '')
            style += 'background: -moz-linear-gradient(#' + bkgColor + ',#' + bkgColor + ') repeat scroll 0 0 #' + bkgColor + '; border-color: #' + bkgColor + '; background-image:-webkit-linear-gradient(#' + bkgColor + ',#' + bkgColor + ')';

        if (tabBkgColor != null && tabBkgColor != undefined && tabBkgColor != '')
            tabStyle += 'text-shadow: none; background: -moz-linear-gradient(#' + tabBkgColor + ',#' + tabBkgColor + ') repeat scroll 0 0 #' + tabBkgColor + '; border-color: #' + tabBkgColor + '; background-image:-webkit-linear-gradient(#' + tabBkgColor + ',#' + tabBkgColor + ');';

        if (tabFontColor != null && tabFontColor != undefined && tabFontColor != '')
            tabStyle += 'color: #' + tabFontColor;

        $(ulView).html('').fadeOut('fast');
        for (p in result) {
            if (result[p] != null && result[p] != undefined) {
                aLink = ShopBigImage(result[p], isDesign, code, fontColor, isImageVisible, price);
                var rssLi = $('<li>').attr('cat', result[p].Category).append(aLink.attr('style', style));
                $(ulView).append(rssLi);
            }
        }

        $(ulView).attr('data-autodividers', true);
        $(ulView).attr('data-filter', searchable);

        $(ulView).listview({
            autodividers: true,
            autodividersSelector: function (li) {
                var out = li.attr('cat');
                return out;
            }
        }).listview('refresh').filter();

        if (searchable == 'true')
            $(ulView).closest('[an-data-role=shopping]').enhanceWithin();

        $(ulView).find('[role=heading]').attr('style', tabStyle);
        $(ulView).fadeIn('fast');
    }
    function ShopBigImage(result, isDesign, code, fontColor, isImageVisible, price) {
        var appCode = myParent.$('#hdnAppCode').val();
        if (appCode == '' || appCode == undefined || appCode == null)
            appCode = '0';

        var desc = result.Description;

        if (desc != null && desc != undefined && desc.length > 20)
            desc = desc.substring(0, 50) + '...';

        var imgTag = result.DefaultImage;
        if (imgTag == '')
            imgTag = '<img src="/apps/' + appCode + '/image/Question_Gray_80x80.png"/>';
        else
            imgTag = '<img src="' + imgTag + '" style="max-width: 80px; max-height: 80px;"/>';

        var img = $(imgTag);
        var h2 = $('<h2 style="text-shadow: none; color: #' + fontColor + '">' + result.Name + '</h2>');
        //var span = $('<span/>').html(result.Title).attr('style', 'margin-bottom: 10px; display: block; padding: 5px 0px;overflow: hidden; text-overflow: ellipsis !important;');
        var p = $('<p/>').html(desc).attr('style', 'text-shadow: none; margin-top: 5px; color: #' + fontColor);
        var b = $('<span class="ui-li-count">' + result.Price + '</span>')
        var aLink = $('<a/>');

        if (isImageVisible == "true")
            aLink.append(img);

        aLink.append(h2);

        aLink.append(p);

        if (result.Price != '' && result.Price != null && price == 'true')
            aLink.append(b);

        if (isDesign == false) {
            aLink.attr('href', AN_CALLBACK_BASE + 'cms/apiadmin/GetShopInfo.aspx?iid=' + result.ItemId + "&appCode=" + code);
        }

        return aLink;
    }

    /* Shop Big Image Collapsible
    --------------------------------------------------*/
    function LoadShopCollapsible(el, result, isDesign, code, bkgColor, tabBkgColor, fontColor, tabFontColor, isImageVisible, price, searchable) {
        var ulView = $(el).find('ul');
        style = '';
        tabStyle = '';

        if (bkgColor != null && bkgColor != undefined && bkgColor != '')
            style += 'background: -moz-linear-gradient(#' + bkgColor + ',#' + bkgColor + ') repeat scroll 0 0 #' + bkgColor + '; border-color: #' + bkgColor + '; background-image:-webkit-linear-gradient(#' + bkgColor + ',#' + bkgColor + ');';

        if (tabBkgColor != null && tabBkgColor != undefined && tabBkgColor != '')
            tabStyle += 'text-shadow: none; background: -moz-linear-gradient(#' + tabBkgColor + ',#' + tabBkgColor + ') repeat scroll 0 0 #' + tabBkgColor + '; border-color: #' + tabBkgColor + '; background-image:-webkit-linear-gradient(#' + tabBkgColor + ',#' + tabBkgColor + ');';

        if (tabFontColor != null && tabFontColor != undefined && tabFontColor != '')
            tabStyle += 'color: #' + tabFontColor;

        $(ulView).html('').fadeOut('fast');
        var dataTheme = $(ulView).attr('data-theme');

        // Grab all the unique category
        var catList = [];
        for (p in result) {
            if (catList.indexOf(result[p].Category) == -1)
                catList.push(result[p].Category);
        }

        var collapsibleHtml = null;
        var ulList = null;
        var collapsibleSet = $('<div/>').attr('data-role', 'collapsible-set').attr('data-theme', dataTheme);

        for (c in catList) {
            ulList = ShopCollapsible(result, catList[c], isDesign, code, style, fontColor, isImageVisible, price, searchable, dataTheme)
            collapsibleHtml = $('<div/>').attr('data-role', 'collapsible').html('<h4>' + catList[c] + '</h4>');
            collapsibleHtml.append(ulList);
            collapsibleSet.append(collapsibleHtml);
        }

        $(el).html('');
        $(el).append(collapsibleSet);
        $(el).find('[data-role=collapsible-set] ul').listview().listview('refresh');
        $(el).find('[data-role=collapsible-set]').collapsibleset().collapsibleset('refresh');
        $(el).find('[data-role=collapsible-set]').find('div.form').attr('style', style).attr('class', 'ui-listview-filter ui-bar-' + dataTheme);
        $(el).find('[data-role=collapsible-set] h4 a').attr('style', style + "color: #" + fontColor + tabStyle);

        if (searchable == 'true')
            $(el).closest('[an-data-role=shopping]').enhanceWithin();
    }
    function ShopCollapsible(results, cat, isDesign, code, style, fontColor, isImageVisible, price, searchable, dataTheme) {
        var appCode = myParent.$('#hdnAppCode').val();
        var desc, imgTag, h2, span, p, b, aLink, ul, li;
        var res;

        if (appCode == '' || appCode == undefined || appCode == null)
            appCode = '0';

        ul = $('<ul/>').attr('data-role', 'listview')
                           .attr('data-inset', 'false')
                           .attr('data-autodivider', 'false')
                           .attr('data-filter', searchable)
                           .attr('data-theme', dataTheme);

        for (r in results) {
            res = results[r];

            if (cat != res.Category)
                continue;

            desc = res.Description;
            imgTag = res.DefaultImage;
            h2 = $('<h2 style="text-shadow: none; color: #' + fontColor + '">' + res.Name + '</h2>');
            p = $('<p/>').html(desc).attr('style', 'text-shadow: none; margin-top: 5px; color: #' + fontColor);
            b = $('<span class="ui-li-count">' + res.Price + '</span>');

            if (desc != null && desc != undefined && desc.length > 20)
                desc = desc.substring(0, 50) + '...';

            if (imgTag == '')
                imgTag = '<img src="/apps/' + appCode + '/image/Question_Gray_80x80.png"/>';
            else
                imgTag = '<img src="' + imgTag + '" style="max-width: 80px; max-height: 80px;"/>';

            aLink = $('<a/>');
            aLink.attr('style', style);

            if (isImageVisible == "true") {
                aLink.append($(imgTag));
            }

            aLink.append(h2);
            aLink.append(p);

            if (res.Price != '' && res.Price != null && price == 'true')
                aLink.append(b);

            if (isDesign == false) {
                aLink.attr('href', AN_CALLBACK_BASE + 'cms/apiadmin/GetShopInfo.aspx?iid=' + res.ItemId + "&appCode=" + code);
            }

            ul.append($('<li/>').append(aLink));
        }

        return ul;
    }

    /* Gallery Code
    --------------------------------------------------*/
    function galleryInit() {
        var inPreview = myParent.$('body').hasClass('design');

        if (!inPreview) {
            $('div[an-data-role=gallery]').each(function () {
                if ($(this).find('ul li a[href]').length > 0) {
                    $(this).find('ul li a[href]').photoSwipe({ enableMouseWheel: false, enableKeyboard: false });
                }
            });

        }
    }

    function galleryDestroy() {
        $('div[an-data-role=gallery]').each(function () {
            if ($(this).find('ul li a[href]').length > 0) {
                $(this).find('ul li a[href]').detach();
            }
        });
    }

    /*  Calendar 
    --------------------------------------------------*/
    function calendarInit() {
        $('div[an-data-role="calendar"]').each(function () {
            var $this = $(this);
            var eData = $this.attr('an-cal-src') || []; //Show no events if attribute not present

            $this.fullCalendar('destroy'); //Ensure there is no previous calendar data to prevent showing it twice...
            $this.fullCalendar({
                events: eData,
                dayClick: dayClicked,
                unselect: calUnselect
            });
        });
    }
    function dayClicked(date, allday, jsEvent, view) {

        $('.ui-loader').fadeIn('fast');
        $.mobile.loading('show', {
            text: 'Loading Events',
            textVisible: true,
            theme: 'a',
            textonly: false,
            html: ''
        });

        var cal = $(this).parents('div.fc[an-data-role="calendar"]')
        if (cal.length < 1) {
            anConsole.error('Could not get associated calendar');
            return;
        } else if (cal.length > 1) {
            anConsole.warn('More than one calendar parent was found... using first (closest parent)')
            cal = cal.first();
        }

        var showTime = cal.attr('an-showtime');
        var endDate = new Date(date);
        endDate.setDate(date.getDate() + 1);

        cal.fullCalendar('select', date, date, true); //Unselects and selects the date chosen

        var events = cal.fullCalendar('clientEvents',
            function (eventObj) {
                if (eventObj.start >= endDate)
                    return false;
                if (eventObj.end < date)
                    return false;
                return true;
            });

        var dvEvent = cal.find("div.an-cal-eventItems");
        if (dvEvent.length != 1)
            return; //No div available for us to put the event info in

        dvEvent.empty();

        var results = "";

        results += '<br/><ul class="an-calInfo" data-role="listview" data-inset="true" ><li data-role="list-divider">Events Details for ';
        results += date.toLocaleDateString() + '</li>';

        var oItems = '';
        for (e in events) {
            oItems += '<li>';
            oItems += '<h2>' + events[e].title + '</h2>';
            oItems += '<p><b>When: </b><br/>' + $.fullCalendar.formatDate(events[e].start, "MM/dd/yyyy") + ' to ';
            oItems += $.fullCalendar.formatDate(events[e].end, "MM/dd/yyyy");

            if (showTime == 'true') {
                var eStart = $.fullCalendar.formatDate(events[e].start, "hh:mm:ss tt"),
                        eEnd = $.fullCalendar.formatDate(events[e].end, "hh:mm:ss tt");
                if (eStart != '00:00:00' && eEnd != '00:00:00')
                    oItems += '<br/><br/><b>Time: </b><br/>' + eStart + ' to ' + eEnd;
            }

            if (events[e].location)
                oItems += '<br/><br/><b>Where: </b><br/> <a href="http://maps.google.com/maps?q=' + encodeURIComponent(events[e].location) + '">' + $('<div/>').text(events[e].location).html() + '</a>';

            if (events[e].description)
                oItems += '<br/><br/><b>Description: </b><br/>' + $('<div/>').text(events[e].description).html();

            oItems += '</p>';
            oItems += '</li>';
        }

        if (oItems == '')
            oItems += '<li><h2>No Events</h2></li>';

        results += oItems + '</ul>';

        dvEvent.append(results);
        dvEvent.find('ul.an-calInfo').listview({
            create: function () {

                $("html, body").animate({ scrollTop: dvEvent.find('ul.an-calInfo').offset().top }, 1000);

                $('.ui-loader').fadeOut(2000, function () {
                    $.mobile.loading('hide');
                });
            }
        });
    }
    function calUnselect(view, jsEvent) {
        //Clear out the event items
        var cal = $(this.element).parents('div.fc[an-data-role="calendar"]')
        if (cal.length < 1) {
            anConsole.error('Could not get associated calendar');
            return;
        } else if (cal.length > 1) {
            anConsole.warn('More than one calendar parent was found... using first (closest parent)')
            cal = cal.first();
        }

        var dvEvent = cal.find("div.an-cal-eventItems");
        if (dvEvent.length != 1)
            return;
        dvEvent.empty();
    }

    /*  Form 
    --------------------------------------------------*/
    function changeFormSubmit() {
        var formSubProc = false;
        $(document).on('click', 'div[an-data-role=submit] input[type=button]', function () {
            if (formSubProc)
                return false;

            formSubProc = true;

            var $this = $(this);
            var formUrl;
            var formMethod;
            switch ($this.attr('an-action-type')) {
                case 'email':
                    formMethod = 'POST';
                    formUrl = $this.attr('an-action-url') + "?emailaddressinput=" + $(this).attr('an-email');
                    break;
                case 'db':
                    formMethod = 'POST';
                    var param = $this.attr('an-destination').split(':');
                    formUrl = $this.attr('an-action-url') + "?bName=" + param[0] + "&tName=" + param[1];
                    break;
                case 'custom':
                    formMethod = $this.attr('an-method');
                    formUrl = $this.attr('an-action-url');
                    break;
            }
            var formData = $this.closest('div.form').find('input[name],select[name],textarea[name]').serialize(); //$this.serialize();
            var typeMsg = 'submit';
            var formMsgSuccess = 'Successfully submitted your request.';
            var isValid = true;
            var valMsg = '';

            //Validate Required form Fields
            $('input.req, textarea.req').each(function (index) {
                if (!($(this).val()) || ($(this).val() == '')) {
                    isValid = false;
                    valMsg += $('label[for=' + ($(this).attr('id')) + ']').text() + ' is required<br/>'
                }
            });

            $('div[an-data-role=radiolist], div[an-data-role=checklist]').each(function () {
                var cntrValid = true;
                if ($(this).find('input.req').length != 0)
                    cntrValid = false;
                $(this).find('input.req').each(function () {
                    if ($(this).is(':checked'))
                        cntrValid = true;
                });
                if (!cntrValid) {
                    isValid = false;
                    valMsg += $(this).find('input:first').attr('name') + ' is required<br/>'
                }
            });
            if (!isValid) {
                CreatePopup($this, 'Error', valMsg);
                $('#popupMenu').popup();
                $('#popupMenu').popup('open');
                $('#popupMenu').fadeOut(5000, function () {
                    $(this).remove();
                });
                formSubProc = isValid;
            }

            if (formMethod.toLowerCase() == 'get') {
                formMsgSuccess = "Successfully received your request.";
            }

            if (formUrl && formSubProc) {
                $.mobile.loading('show');

                $.ajax({
                    url: formUrl,
                    type: 'POST',
                    data: formData,
                    timeout: timeOut,
                    datatype: 'html',
                    success: function (msg) {

                        //custom URL may return any response data. so if the request falls in success, it is considered as success

                        if ($this.attr('an-action-type') != 'custom')
                            if (msg == 'success')
                                CreatePopup($this, 'Success', formMsgSuccess);
                            else
                                CreatePopup($this, 'Error', msg);
                        else
                            CreatePopup($this, 'Success', formMsgSuccess);

                        $('#popupMenu').popup();
                        $('#popupMenu').popup('open');

                        $('#popupMenu').fadeOut(5000, function () {
                            $(this).remove();
                        });

                        $.mobile.loading('hide');

                        formSubProc = false;
                    },
                    error: function (jqXHR) {
                        if (jqXHR.statusText == 'timeout')
                            CreatePopup($this, "Login Failed.", 'Server timed out.');
                        else if (e != '' && e != undefined)
                            CreatePopup($this, 'Failed', 'There was an error submitting your request. Try again or contact support.');
                        else
                            CreatePopup($this, 'Success', 'Request has been submitted.');

                        $('#popupMenu').popup();
                        $('#popupMenu').popup('open');

                        $('#popupMenu').fadeOut(5000, function () {
                            $(this).remove();
                        });
                        $.mobile.loading('hide');
                        formSubProc = false;
                    }
                });
            }

            return false;
        });

    }
    function CreatePopup(e, title, msg) {

        $('#popupMenu').remove();
        var Popup = '<div data-role="popup" id="popupMenu" data-theme="a"> '
                        + '<div data-role="popup" data-theme="a" class="ui-corner-all">'
                        + '<div style="padding:10px 20px;">'
                        + '<h3>' + title + '</h3>'
                        + '<span>' + msg + '</span>'
                        + '</div>'
                        + '</div>'
                        + '</div>';
        $(e).append(Popup);
    }
    function AN_PopupMessage(e, title, msg, time) {
        CreatePopup(e, title, msg);
        var p = $('#popupMenu');
        p.popup();
        p.popup('open');
        p.fadeOut(time || 5000, function () { $(this).remove(); });
    }

    /* Chat Code
    --------------------------------------------------*/
    function chatInit(isDesign) {
        if (isDesign)
            return;

        $('[an-data-role=chat]').each(function () {
            var interval = $(this).attr('an-interval');
            var code = $(this).attr('an-code');
            if (!isDesign) {

                interval = interval * 1000;
                $(this).find('#dvChatLog').html('<ul data-role="listview" ></ul>');
                GrabData(this, code, interval);

            }

        });

    }
    function GrabData(el, code, interval) {
        if (interval == null || interval == undefined || isNaN(interval))
            interval = 30000;

        var l = $(el).attr('an-data-log');
        var b = $(el).attr('an-data-book');

        if ($(el).closest('.an-control-container').find('#dvChatLog ul').html() == '' ||
               $(el).closest('.an-control-container').find('#dvChatLog ul').html() == '\n\r') {
            $.mobile.loading('show', {
                text: 'fetching data...',
                textVisible: true
            });
        }

        $this = $(el);
        $.ajax({
            url: AN_CALLBACK_BASE + 'cms/apiadmin/callback/chat/get.aspx',
            timeout: timeOut,
            data: { tName: l, bName: b },
            type: 'POST',
            global: false,
            success: function (msg) {
                if (msg != '' && msg != undefined && msg != null && msg != '[]') {
                    var jsonObj = msg;
                    var sTr = '';

                    for (var i = jsonObj.length; i >= 1; i--) {

                        var check = $(el).closest('[an-cctrl=true]').find('#dvChatLog ul').find('[an-timestamp=' + jsonObj[i - 1].TimeStamp.replace('+', '_').replace('.', '_') + ']')[0];

                        if (!check) {
                            var postDate = new Date(jsonObj[i - 1].PostedDate);
                            var fDate = $.fullCalendar.formatDate(postDate, "MM/dd/yyyy hh:mm:ss tt");
                            sTr += '<li an-timestamp="' + jsonObj[i - 1].TimeStamp.replace('+', '_').replace('.', '_') + '" style="padding: 10px 25px;"><h3 style="font-size: 12px; font-weight:bold;">' + jsonObj[i - 1].Name + ':</h3>' +
                                        '<p class="ui-li-aside" style="font-size: 10px;">' + fDate + '</p><p style="font-style: italic;">' + jsonObj[i - 1].Msg + '</p></li>';
                        }

                    }

                    if (sTr) {
                        if ($(el).attr('an-cctrl')) {
                            $(el).find('#dvChatLog ul').append(sTr);
                            $(el).find('#dvChatLog').find('ul').listview().listview('refresh');
                        }
                        else {
                            $(el).closest('[an-cctrl=true]').find('#dvChatLog ul').append(sTr);
                            $(el).closest('[an-cctrl=true]').find('#dvChatLog ul').listview().listview('refresh');
                        }
                    }
                }

                $(el).closest('[an-cctrl=true]').find('#dvChatLog').scrollTop($('#dvChatLog')[0].scrollHeight);
                setTimeout(function () {
                    GrabData(el, code, interval);
                }, interval);
                $.mobile.loading('hide');
            },
            error: function (e) {
                $.mobile.loading('hide');

                if (e.statusText == 'timeout')
                    CreatePopup($this, "Failed.", 'Server timed out.');
                else
                    CreatePopup($this, "Failed.", 'Cannot connect to server.');

                $('#popupMenu').popup();
                $('#popupMenu').popup('open');

                $('#popupMenu').fadeOut(5000, function () {
                    $(this).remove();
                });
            }
        });

    }

    /* Registration 
    --------------------------------------------------*/
    function register(container) {
        var code = container.attr('an-code');
        var table = container.attr('an-log');
        var mail = container.find('#Email').val();
        var confemail = container.find('#ConfEmail').val();
        var pwd = container.find('#Password').val();
        var confpass = container.find('#ConfPassword').val();
        var redirectTo = container.attr('an-redirect-url');
        var animation = 'fade';
        var isRel = -2;

        if (redirectTo != null && redirectTo != undefined)
            isRel = redirectTo.indexOf('http://');

        var firstName = container.find('#FirstName').val();
        var lastName = container.find('#LastName').val();

        var errorMsg = "";

        if (animation == '' || animation == undefined || animation == null)
            animation = 'fade';

        if (!ValidateEmail(mail))
            errorMsg += "Please enter a valid email.<br/>";

        if (mail != confemail && errorMsg == '')
            errorMsg += "Email Confirmation did not match.<br/>";

        if (pwd == '' && confpass == '')
            errorMsg += "Please enter a valid password.<br/>";

        if (pwd != confpass)
            errorMsg += "Password did not match.<br/>";

        if (firstName == '')
            errorMsg += "Please Enter your first name<br/>";
        if (lastName == '')
            errorMsg += "Please Enter your last name<br/>";

        if (errorMsg != '') {
            CreatePopup(container, "", errorMsg);
            $('#popupMenu').popup();
            $('#popupMenu').popup('open');

            $('#popupMenu').fadeOut(5000, function () {
                $(this).remove();
            });

        }
        else {

            $.mobile.loading('show', {
                text: 'Registering...',
                textVisible: true
            });
            $.ajax({
                url: AN_CALLBACK_BASE + 'cms/apiadmin/callback/auth/mobileReg.aspx',
                data: {
                    appcode: code, email: mail,
                    pass: pwd, fName: firstName,
                    lName: lastName, tName: table
                },
                timeout: timeOut,
                type: 'POST',
                xhrFields: {
                    withCredentials: true
                },
                success: function (msg) {
                    msg = msg.split(':');

                    $.mobile.loading('hide');
                    if (msg[0] == 'success') {
                        CreatePopup(container, "", msg[1]);
                        $('#popupMenu').popup();
                        $('#popupMenu').popup('open');

                        $('#popupMenu').fadeOut(3000, function () {
                            $(this).remove();
                        });

                        if (isRel != -1 && isRel != -2)
                            window.location.href = redirectTo;
                        else if (isRel != -2) {
                            // for Preview
                            if (redirectTo.indexOf('#prevPage') != -1) {
                                var currUrl = redirectTo.substring(redirectTo.lastIndexOf('#prev'));
                                PageTryLoad(currUrl, { transition: animation });
                            }
                            else
                                $.mobile.changePage(redirectTo, { transition: animation });
                        }
                        else {
                            window.location.history.back(-1);
                        }

                    }
                    else {
                        CreatePopup(container, "", msg[1]);
                        $('#popupMenu').popup();
                        $('#popupMenu').popup('open');

                        $('#popupMenu').fadeOut(5000, function () {
                            $(this).remove();
                        });

                        container.find('#Email').val('');
                        container.find('#ConfEmail').val('');
                        container.find('#Password').val('');
                        container.find('#ConfPassword').val('');

                        container.find('#FirstName').val('');
                        container.find('#LastName').val('');
                    }
                },
                error: function (msg) {
                    $.mobile.loading('hide');
                    msg = msg.split(':');

                    if (e.statusText == 'timeout')
                        CreatePopup(container, "", 'Server timed out.');
                    else
                        CreatePopup(container, "", msg[1]);

                    $('#popupMenu').popup();
                    $('#popupMenu').popup('open');

                    $('#popupMenu').fadeOut(5000, function () {
                        $(this).remove();
                    });
                }
            });
        }

    }
    function ValidateEmail(email) {
        var re = /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
        return re.test(email);
    }
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    function checkSSO() {
        var checkSSO = getsetLocalStorage('an-check-sso', null, null);
        if (getParameterByName("code") && checkSSO && checkSSO != '') {
            login($('[data-role=login]').closest('[data-role=login]'), null, getParameterByName("code"));
            getsetLocalStorage('an-check-sso', true, 'remove');
        }
    }

    /* Login
    --------------------------------------------------*/
    function login(container, type, authCode) {
        var code = container.attr('an-code');
        var table = container.attr('an-data-log');
        var redirectTo = container.attr('an-redirect-url');
        var mail = container.find('#an-Email').val();
        var pwd = container.find('#an-Password').val();
        var rememberMe = (container.find("#an-RememberMe").attr('checked') == 'checked' ? true : false);
        var animation = container.attr('an-redirect-animation');
        var checkSSO = getsetLocalStorage('an-check-sso', null, null);
        var isRel = -2;
        anConsole.log(table);

        var winUrl = window.location.href;
        var pcode;

        if (winUrl.indexOf('?') != -1)
            pcode = winUrl.substring(winUrl.indexOf('?') + 1);

        if (redirectTo != undefined && redirectTo != null)
            isRel = redirectTo.indexOf('http://');

        var errorMsg = '';

        // Allows the CheckSSO func to call call login on load.
        if (type != '' && !checkSSO) {
            getsetLocalStorage('an-check-sso', true, null);
        }

        if (!ValidateEmail(mail) && pcode == undefined && type == undefined)
            errorMsg += 'Invalid Email.<br/>';

        if (mail == '' && pwd == '' && type == undefined && pcode == undefined)
            errorMsg += 'Please enter a valid email and password.';

        if (animation == '' || animation == undefined || animation == null)
            animation = 'fade';

        if (errorMsg != '' || code == undefined) {
            CreatePopup(container, "", errorMsg);
            $('#popupMenu').popup();
            $('#popupMenu').popup('open');

            $('#popupMenu').fadeOut(5000, function () {
                $(this).remove();
            });
        }
        else {

            $.mobile.loading('show', {
                text: 'Logging in...',
                textVisible: true
            });

            $.ajax({
                url: AN_CALLBACK_BASE + 'cms/apiadmin/callback/auth/mobileLogin.aspx',
                data: {
                    appcode: code, email: mail, pass: pwd,
                    rememberMe: rememberMe, type: type,
                    authCode: authCode, redirect: window.location.pathname,
                    tName: table
                },
                timeout: timeOut,
                type: 'POST',
                xhrFields: {
                    withCredentials: true
                },
                success: function (msg) {

                    if (msg.indexOf('accounts.google.com') == -1 && msg.indexOf('graph.facebook.com') == -1)
                        msg = msg.split(':');
                    $.mobile.loading('hide');

                    if (rememberMe)
                        getsetLocalStorage("an_" + code + "_auth_" + table, mail + ":" + pwd, 'set');
                    else
                        getsetLocalStorage("an_" + code + "_auth_" + table, mail + ":" + pwd, 'remove');


                    if (msg[0] == 'success') {

                        CreatePopup(container, "", msg[1]);
                        $('#popupMenu').popup().popup('open');

                        $('#popupMenu').fadeOut(3000, function () {
                            $(this).remove();
                        });

                        if (isRel != -1 && isRel != -2)
                            window.location.href = redirectTo;
                        else if (isRel != -2) {
                            // for Preview
                            if (redirectTo.indexOf('#prevPage') != -1) {
                                var currUrl = redirectTo.substring(redirectTo.lastIndexOf('#prev'));
                                PageTryLoad(currUrl, { transition: animation });
                            }
                            else {
                                if (authCode)
                                    window.location.href = redirectTo;
                                else
                                    $.mobile.changePage(redirectTo, { transition: animation });
                            }
                        }
                    }
                    else if (msg.indexOf('accounts.google.com') != -1 || msg.indexOf('graph.facebook.com') != -1) {
                        var isDesign = $('body.bPreview');
                        if (isDesign.length == 0)
                            window.location.href = msg;
                        else {
                            CreatePopup(container, "", msg[1]);
                            $('#popupMenu').popup();
                            $('#popupMenu').popup('open');

                            $('#popupMenu').fadeOut(5000, function () {
                                $(this).remove();
                            });
                        }
                    }
                    else {
                        CreatePopup(container, "", msg[1]);
                        $('#popupMenu').popup();
                        $('#popupMenu').popup('open');

                        $('#popupMenu').fadeOut(5000, function () {
                            $(this).remove();
                        });
                    }

                },
                error: function (e) {
                    $.mobile.loading('hide');

                    if (e.statusText == 'timeout')
                        CreatePopup(container, "Login Failed.", 'Server timed out.');
                    else
                        CreatePopup(container, "", msg);

                    $('#popupMenu').popup();
                    $('#popupMenu').popup('open');

                    $('#popupMenu').fadeOut(5000, function () {
                        $(this).remove();
                    });

                }
            });
        }
    }

    /* Get Secured Pages
    --------------------------------------------------*/
    function LoadSecPage(el) {
        var currDom = $('<div/>').html($(el).html());
        var currHtml = currDom.find('[an-data=secured]');
        //anConsole.log('pageshow - div currHtml:' + currDom.html().substring(0, 40) + "----" + $(currHtml).html());
        var bCheck = $(currHtml).html();
        if (bCheck != undefined && bCheck != 'undefined' && bCheck != null) {

            var data = currHtml.html().split(':');

            $('[an-id=ansecLoader]').remove();
            $(el).find('[an-data]').parent().append('<div an-id="ansecLoader" style="margin-top: 25px; text-align: center;"><h3>Loading data please wait...</h3></div>');
            $(el).find('[an-data]').hide();
            retrieveScreen(el, data[0], data[2], data[1]);
        }
    }
    function retrieveScreen(el, pid, t, code) {
        //anConsole.log('retrieveScreen(' + el + ', ' + pid + ', ' + t + ', ' + code + ') - start');

        $.ajax({
            url: AN_CALLBACK_BASE + 'cms/apiadmin/callback/auth/GetScreen.aspx',
            data: { appcode: code, pid: pid, type: t },
            type: 'POST',
            xhrFields: {
                withCredentials: true
            },
            success: function (msg) {
                //anConsole.log('retrieveScreen(' + el + ', ' + pid + ', ' + t + ', ' + code + ') - success');
                msg = $(msg).attr('id', 'sec-' + pid).attr('data-role', 'page');
                $('body').append(msg);
                $.mobile.changePage(msg);
                $.mobile.loading('hide');
                //anConsole.log('retrieveScreen(' + el + ', ' + pid + ', ' + t + ', ' + code + ') - finish');
            }
        });
    }

    /* Toggle Panel
    --------------------------------------------------*/
    function TogglePanel(name) {
        if ($.mobile.activePage.jqmData("panel") !== "open")
            $.mobile.activePage.find(name).panel("open");
        else
            $.mobile.activePage.find(name).panel("close")
    }
    function checkForLogin() {
        $('[data-role=login]').each(function () {
            locLogin = $(this);
            appCode = locLogin.attr('an-code');
            tName = locLogin.attr('an-data-log');

            var val = getsetLocalStorage("an_" + appCode + "_auth_" + tName, null);
            if (val == null || val == 'null')
                return;

            val = val.split(':');

            locLogin.find('#an-Email').val(val[0]);
            locLogin.find('#an-Password').val(val[1]);
            locLogin.find('#an-RememberMe').attr('checked', true);
        });

    }
    function grabCookie(name) {
        var cookies = document.cookie.split(';');
        var currCookie = null;
        for (var c in cookies) {
            currCookie = cookies[c].split('=');
            if (currCookie[0].replace(' ', '') == name) {
                var vals = currCookie[1].split('~');
                var email = vals[0];
                var pass = vals[1];

                $('[data-role=login]').find('#an-Email').val(email);
                $('[data-role=login]').find('#an-Password').val(pass);
                return email;
            }
        }
    }
    function openPopup(id, el) {
        var animation = $(id).attr('data-transition');

        if (animation == '' || animation == undefined || animation == null)
            animation = 'slideup';

        $(id).popup().popup('open');
    }

    /*
    ---------------------------------------------------*/
    function getsetLocalStorage(key, val, mode) {
        if (val == null && val == undefined)
            return localStorage.getItem(key);
        else if (mode != 'remove')
            localStorage.setItem(key, val);
        else
            localStorage.removeItem(key);
    }

    /* Social Media Listener/Function
    --------------------------------------------------*/
    function showHideFacebookTweeter(el, mode) {
        if (isDesign == 'true')
            return;

        // LOGIC FOR THE TAB CHANGE
        if (mode == 'fb') {
            $(el).closest('[an-data-role=socialmedia]').find('.panel').show();
            $(el).closest('[an-data-role=socialmedia]').find('#divTweets').hide();
            $(el).closest('[an-data-role=socialmedia]').find('#pinterestpins').hide();
            $(el).closest('[an-data-role=socialmedia]').find('#instafeed').hide();
            $(el).closest('[an-data-role=socialmedia]').find('#divgposts').hide();
        }
        if (mode == 'ins') {

            $(el).closest('[an-data-role=socialmedia]').find('#instafeed').show();
            $(el).closest('[an-data-role=socialmedia]').find('#divTweets').hide();
            $(el).closest('[an-data-role=socialmedia]').find('.panel').hide();
            $(el).closest('[an-data-role=socialmedia]').find('#divgposts').hide();
            $(el).closest('[an-data-role=socialmedia]').find('#pinterestpins').hide();
        }
        if (mode == 'pin') {
            pinterestInit();

            $(el).closest('[an-data-role=socialmedia]').find('.panel').hide();
            $(el).closest('[an-data-role=socialmedia]').find('#divTweets').hide();
            $(el).closest('[an-data-role=socialmedia]').find('#instafeed').hide();
            $(el).closest('[an-data-role=socialmedia]').find('#divgposts').hide();
            $(el).closest('[an-data-role=socialmedia]').find('#pinterestpins').show();

        }
        if (mode == 'tw') {
            $(el).closest('[an-data-role=socialmedia]').find('.panel').hide();
            $(el).closest('[an-data-role=socialmedia]').find('#pinterestpins').hide();
            $(el).closest('[an-data-role=socialmedia]').find('#instafeed').hide();
            $(el).closest('[an-data-role=socialmedia]').find('#divgposts').hide();
            $(el).closest('[an-data-role=socialmedia]').find('#divTweets').show();
        }
        if (mode == 'gplus') {
            $(el).closest('[an-data-role=socialmedia]').find('.panel').hide();
            $(el).closest('[an-data-role=socialmedia]').find('#pinterestpins').hide();
            $(el).closest('[an-data-role=socialmedia]').find('#instafeed').hide();
            $(el).closest('[an-data-role=socialmedia]').find('#divTweets').hide();
            $(el).closest('[an-data-role=socialmedia]').find('#divgposts').show();
            googlePlusInit(el);
        }
    }
    function fbWallInit() {

        if (isDesign == 'true')
            return;

        var fbId = 0;
        var fbAccessToken = 0;
        $('[an-action=fbfeeds]').each(function () {
            fbId = $(this).attr('fbId');
            fbAccessToken = $(this).attr('fbAccessToken');

            $(this).fbWall({
                id: fbId,
                accessToken: fbAccessToken,
                showGuestEntries: true,
                showComments: true,
                max: 5,
                timeConversion: 24
            });
        });

    }
    function instagramInit() {

        if (isDesign == 'true')
            return;

        var insUserId = 0;
        var insAccessToken = "";
        $('[an-action=insFeeds]').each(function () {
            insUserId = $(this).attr('insUserId');
            insAccessToken = $(this).attr('insAccessToken');

            if (insUserId != '' && insUserId != undefined)
                insUserId = parseInt(insUserId);

            var userFeed = new Instafeed({
                get: 'user',
                userId: insUserId,
                resolution: 'thumbnail',
                accessToken: insAccessToken
            });
            userFeed.run();

        });
    }
    function googlePlusInit(el) {

        if (isDesign == 'true')
            return;

        var gpapi = $(el).closest('[an-data-role=socialmedia]').find('[an-action=gpFeeds]');
        if (gpapi[0] != undefined) {
            var gpAPIKey = "";
            gpAPIKey = $(gpapi).attr('gpAPIKey');
            jQuery.fn.googlePlusActivity.defaults.api_key = gpAPIKey;
            $('[an-action=gpFeeds]').googlePlusActivity();
        }
    }
    function pinterestInit() {

        if (isDesign == 'true')
            return;

        if ($('[data-pin-do]')[0] != undefined) {
            $('[data-pin-do]').each(function () {
                var pinId = $(this).attr('an-pintrestid');
                var sDate = (new Date).getTime();

                if (!pinId)
                    pinId = 'appnotchseclabs';

                var sUrl = AN_CALLBACK_BASE + 'web/callback/RssConsumer.aspx?sUrl=http://www.pinterest.com/' + pinId + '/feed.rss';

                var container = $($(this).parent());
                $.ajax({
                    url: sUrl,
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (e) {
                        container.html('<ul></ul>');
                        for (p in e) {
                            var imgTag = e[p].Image;
                            if (!imgTag)
                                continue;
                            container.find('ul').append('<li style="float:left; width:80px; height: 80px; text-align: center;display:block; margin: 3px;"><a href="' + imgTag + '"><img style="width:80px; height: 80px;" src="' + imgTag + '"/></a></li>');
                        }

                        container.find('li a[href]').photoSwipe({ enableMouseWheel: false, enableKeyboard: false });
                    }
                });
            });

        }
    }

    function showFirstSocialMedia() {
        $('[an-data-role=socialmedia]').find('.panel').hide();
        $('[an-data-role=socialmedia]').find('#divTweets').hide();
        $('[an-data-role=socialmedia]').find('#pinterestpins').hide();
        $('[an-data-role=socialmedia]').find('#instafeed').hide();
        $('[an-data-role=socialmedia]').find('#divgposts').hide();
        $('[an-data-role=socialmedia]').each(function () {
            var val = $(this).find('ul:first li:visible').attr('an-value');

            switch (val) {
                case 'fb':
                    $(this).closest('[an-data-role=socialmedia]').find('.panel').show();
                    break;
                case 'ins':
                    $(this).closest('[an-data-role=socialmedia]').find('#instafeed').show();
                    break;
                case 'pin':
                    $(this).closest('[an-data-role=socialmedia]').find('#pinterestpins').show();
                    pinterestInit();
                    break;
                case 'tw':
                    $(this).closest('[an-data-role=socialmedia]').find('#divTweets').show();
                    break;
                    break;
                case 'gplus':
                    $(this).closest('[an-data-role=socialmedia]').find('#divgposts').show();
                    googlePlusInit(this);
                    break;
            }
        });
    }

    // Function to load youtube channel
    function YoutubeChannelInit() {
        $("div[an-data-role=youtubevideo]").each(function (index, elm) {
            var iframe = $(elm).find('iframe').first();
            if (iframe.attr('data-channel') == 'true') {
                var name = iframe.attr('data-channel-name');
                if (!name) return; //Name was not set or is an empty string, no sense in making an API call
                $.ajax({
                    url: "http://gdata.youtube.com/feeds/api/videos?author=" + name + "&v=2&alt=json",
                    type: 'GET',
                    dataType: 'jsonp',
                    crossDomain: true,
                    success: function (data) {
                        try {
                            var feed = data['feed'];
                            if (!feed) return; //No feed data
                            var entry = feed['entry'];
                            if (!entry) return; //No entries
                            for (var i = 0, len = entry.length; i < len; i++) {
                                if (i == 0) {
                                    var src = "http://www.youtube.com/embed/" + entry[0]['media$group']['yt$videoid']['$t'];
                                    iframe.attr("src", src);
                                }
                                //anConsole.log(entry[i]);
                                //anConsole.log(entry[i]['media$group']);
                                //anConsole.log(entry[i]['media$group']['yt$videoid']['$t']);
                                var tbl = "<tr data-video-id='" + entry[i]['media$group']['yt$videoid']['$t'] + "' class='ytList'><td><img src='" + entry[i]['media$group']['media$thumbnail'][0]['url'] + "' /></td><td valign='top'><h5><span class='ui-title'>" + entry[i]['title']['$t'] + "</span></h5></td></tr>";
                                $(elm).find('.vidlist').first().append(tbl);
                            }
                            //anConsole.log($(elm).find('.vidlist').first().find('tr').length);
                            $(elm).find('.vidlist').first().find('tr').each(function (idx, elmnt) {

                                $(elmnt).off('click').on('click', function () {
                                    var src = "http://www.youtube.com/embed/" + $(this).attr('data-video-id');
                                    iframe.attr("src", src);
                                });
                            });
                        }
                        catch (e) {
                            anConsole.error('YoutubeChannelInit Error ', e);
                        }
                    }
                });
            }
        });
    }

    //Carousal Image Slider
    function CarousalImageSlider() {
        var isDesign = $('body').attr('an-design');

        if (isDesign == null || isDesign == undefined)
            isDesign = false;
        if (!isDesign)
            $("div[an-data-role=imageslider]").each(function (index, elm) {
                var cnt = $(elm).attr('desktopcount');
                var deskCnt = (cnt == undefined || isNaN(cnt)) ? 10 : cnt;
                cnt = $(elm).attr('tabletcount');
                var tabCnt = (cnt == undefined || isNaN(cnt)) ? 5 : cnt;
                cnt = $(elm).attr('mobilecount');
                var mobCnt = (cnt == undefined || isNaN(cnt)) ? 3 : cnt;
                $(elm).find(".owl-carousel").owlCarousel({
                    items: 5,
                    itemsDesktop: [1399, deskCnt],
                    itemsTablet: [768, tabCnt],
                    itemsMobile: [479, mobCnt],
                    responsiveRefreshRate: 200
                });
            });
    }

    // Google Sheet Data
    function GetGoogleSheetData(documentName, sheetName, query) {
        if (query == undefined)
            query = '';
        var deferred = $.Deferred();
        $.ajax({
            url: AN_CALLBACK_BASE + 'cms/apiadmin/callback/googlesheet/GetData.aspx',
            data: { docname: documentName, formname: sheetName, query: query },
            type: 'POST',
            global: false,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                var newObj = [];
                $.each(data, function (index, value) {
                    newObj.push(value.RowData);
                });
                deferred.resolve(newObj);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                deferred.reject(jqXHR, textStatus, errorThrown);
            }
        });
        return deferred.promise();
    }

    // Google Sheet update Data
    var AN_GoogleSheet = {
        UpdateGoogleSheetData: function (documentName, sheetName, updateData, query) {
            var deferred = $.Deferred();
            updateData = JSON.stringify(updateData);
            anConsole.log(query);
            $.ajax({
                url: AN_CALLBACK_BASE + 'cms/apiadmin/callback/googlesheet/UpdataData.aspx',
                data: { docname: documentName, formname: sheetName, updatedata: updateData, query: query },
                type: 'POST',
                global: false,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    anConsole.log(data);
                    deferred.resolve(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    deferred.reject(jqXHR, textStatus, errorThrown);
                }
            });
            return deferred.promise();
        },
        DeleteGoogleSheetData: function (documentName, sheetName, query) {
            var deferred = $.Deferred();
            anConsole.log(query);
            $.ajax({
                url: AN_CALLBACK_BASE + 'cms/apiadmin/callback/googlesheet/DeleteData.aspx',
                data: { docname: documentName, formname: sheetName, query: query },
                type: 'POST',
                global: false,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    anConsole.log(data);
                    deferred.resolve(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    deferred.reject(jqXHR, textStatus, errorThrown);
                }
            });
            return deferred.promise();
        }
    };

    //Canvas Upload
    function LoadSignature() {
        $('div[an-data-role=signature]').each(function (index, elm) {
            $(elm).find('a[data-canvas=true]').off('click').on('click', function () {
                var htmlSign = '<div class="divSign-app-canvas"><h5 style="text-align: center;padding-top: 3px;"><span class="ui-title" an-content="true">Draw Or Sign Here</span></h5>\
            <div class="drawSign-app-canvas"></div>\
            <ul>\
            <li style="display:table-cell;width: 80px;"><a class="ui-btn ui-shadow ui-btn-corner-all ui-first-child ui-last-child ui-btn-up-a clear">Clear</a></li>\
            <li style="display:table-cell;width: 80px;"><a class="ui-btn ui-shadow ui-btn-corner-all ui-first-child ui-last-child ui-btn-up-a done">Done</a></li>\
            <li style="display:table-cell;width: 80px;"><a class="ui-btn ui-shadow ui-btn-corner-all ui-first-child ui-last-child ui-btn-up-a cancel">Cancel</a></li>\
            </ul></div>';
                if ($(".divSign-app-canvas").length > 0) {
                    $(".divSign-app-canvas").remove();
                }
                $('[data-role="page"]').append(htmlSign);
                $(".divSign-app-canvas").attr('style', 'height:100%;width:100%;z-index:1000;background-color:#fff;position:absolute; top:0;left0; text-align:left;');
                $(".drawSign-app-canvas").attr('style', 'height:300px;width:100%;  border:2px Solid #ddd;');
                var hei = 300; $(".drawSign-app-canvas").css('height');
                var wid = $(".drawSign-app-canvas").css('width');
                $(".drawSign-app-canvas").jSignature({ height: hei, width: wid });

                // to prevent touch moving while drawing
                document.ontouchmove = function (e) {
                    e.preventDefault();
                };
                $(".divSign-app-canvas .clear").on('click', function () {
                    $(".drawSign-app-canvas").empty();
                    $(".drawSign-app-canvas").jSignature({ height: hei, width: wid });
                });
                $(".divSign-app-canvas .done").on('click', function () {
                    document.ontouchmove = function (e) {
                        //  e.preventDefault();
                    };
                    $(".drawSign-app-canvas").each(function (i, canvas) {
                        //                    if (i == 0)
                        //                        return;
                        var data = $(canvas).jSignature('getData', 'image');
                        $.mobile.loading('show', {
                            text: 'Saving...',
                            textVisible: true
                        });
                        $.ajax({
                            type: 'POST',
                            url: AN_CALLBACK_BASE + 'cms/APIAdmin/callback/canvas/SaveData.ashx',
                            data: 'frmData=' + data[1],
                            dataType: 'html',
                            success: function (msg) {
                                CreatePopup($('body'), 'Success', 'Image saved successfully!');
                                msg = msg.replace('"', "");
                                msg = AN_CALLBACK_BASE + msg.substring(1, msg.length);
                                var name = $(elm).attr('data-name');
                                if (name == undefined)
                                    name = "Link";
                                var CanvasUrlId = $(elm).attr('data-id');
                                if ($(elm).find('.' + name).length > 0) {
                                    $(elm).find('.' + name).remove();
                                }
                                $(elm).append('<div class="' + name + '"><a target="_blank" class="ui-btn ui-shadow ui-btn-corner-all ui-first-child ui-last-child ui-btn-hover-a ui-btn-up-a" style="padding:3px;" href="' + msg + '">' + name + '</a><input id="' + CanvasUrlId + '" name="' + name + '" type="hidden" value="' + msg + '" /></div>');
                                if ($(".divSign-app-canvas").length > 0) {
                                    $(".divSign-app-canvas").remove();
                                }
                                $.mobile.loading('hide');
                            }
                        });
                    });
                });
                $(".divSign-app-canvas .cancel").on('click', function () {
                    document.ontouchmove = function (e) {
                        //  e.preventDefault();
                    };
                    if ($(".divSign-app-canvas").length > 0) {
                        $(".divSign-app-canvas").remove();
                    }
                });
            });
        });
    }

    //Dynamic Control Load
    function LoadDynamicControls() {
        $('[data-role=an-viewer]').each(function () {
            var url = $(this).attr('data-url');
            if (!url || url == '')
                return;

            $t = $(this);

            $.mobile.loading("show", {
                text: "Loading Controls Please wait...",
                textVisible: true
            });

            CheckDCRequiredJS($t, url);
        });
    }

    function CheckDCRequiredJS(t, url) {
        loadCSS();
        loadYDS().then(loadUnderscore)
                 .then(loadMobileScript)
                 .then(loadWSScript)
                 .then(loadTemplate)
                 .then(function () {
                     $.when(App.init()).done(App.createPartial(t, url).done(
                        function () {
                            if (AppNotch.Android)
                                AppNotch.Android.fixPage();
                            else if (typeof (openWindowFix) == 'function')
                                openWindowFix();
                        }
                    ));
                 });
    }

    function forceLoad(t, d) {
        loadCSS();
        return loadYDS().then(loadUnderscore)
                        .then(loadMobileScript)
                        .then(loadWSScript)
                        .then(loadTemplate)
                        .then(App.init);
    }

    function loadYDS() {
       
        return $.ajax({
            url: viewerUrl + '/global/script/ydn.min.js',
            success: function (res) {
                getsetLocalStorage("yds", res, null);
            }
        }).always(function () {
            var def = new $.Deferred();
            var script = $('<script/>').attr('data-remove', 'true').attr('type', 'text/javascript');

            var ydsScript = getsetLocalStorage("yds", null, null);
            if (ydsScript) {
                script.text(ydsScript);
                $('head').append(script);
                def.resolve();
                return def.promise();
            }
        });
    };

    function loadUnderscore() {
        var def = new $.Deferred();
        var script = $('<script/>').attr('data-remove', 'true').attr('type', 'text/javascript');

        return $.ajax({
            url: viewerUrl + '/global/script/underscore.min.js',
            success: function (res) {
                getsetLocalStorage("underscore", res, null);
            }
        }).always(function () {
            var underscoreScript = getsetLocalStorage("underscore", null, null);
            if (underscoreScript) {
                script.text(underscoreScript);
                $('head').append(script);
                def.resolve();
                return def.promise();
            }
        });
    };

    function loadMobileScript() {
        
        return $.ajax({
            url: viewerUrl + '/global/script/an.mobilescript.js',
            success: function (res) {
                getsetLocalStorage("mobilescript", res, null);
            }
        }).always(function () {
            var def = new $.Deferred();
            var script = $('<script/>').attr('data-remove', 'true').attr('type', 'text/javascript');

            var mobileScript = getsetLocalStorage("mobilescript", null, null);
            if (mobileScript) {
                script.text(mobileScript);
                $('head').append(script);
                def.resolve();
                return def.promise();
            }
        });
    }

    function loadWSScript() {
       
        return $.ajax({
            url: viewerUrl + '/global/script/an.wsmobile.core.js',
            success: function (res) {
                getsetLocalStorage("wsscript", res, null);
            }
        }).always(function () {
            var def = new $.Deferred();
            var script = $('<script/>').attr('data-remove', 'true').attr('type', 'text/javascript');

            var wsScript = getsetLocalStorage("wsscript", null, null);
            if (wsScript) {
                script.text(wsScript);
                $('head').append(script);
                def.resolve();
                return def.promise();
            }
        });
    }

    function loadTemplate() {
        return $.ajax({
            url: viewerUrl + '/templates.html',
            success: function (res) {
                getsetLocalStorage("templates", res, null);
            }
        }).always(function () {
            var def = new $.Deferred();
            var templateScript = getsetLocalStorage("templates", null, null);

            if (templateScript) {
                $('body').append(templateScript);
                def.resolve();
                return def.promise();
            }
        });
    }

    function loadCSS() {
        var def = new $.Deferred();
        var style = $('<style/>').attr('type', 'text/css');

        return $.ajax({
            url: viewerUrl + '/global/style/an.mobile.css',
            success: function (res) {
                getsetLocalStorage("css", res, null);
            }
        }).always(function () {
            var localCSS = getsetLocalStorage("css", null, null);
            if (localCSS) {
                style.html(localCSS);
                $('head').append(style);
                def.resolve();
                return def.promise();
            };
        });
    }

    // Grabs any exisiting Querystring from the browser url.
    var getQS = function () {
        var qs = [];
        var hash = null;

        var hashes = window.location.href
                           .slice(window.location.href.indexOf('?') + 1).split('&');

        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split(/=(.+)?/);
            qs.push(hash[0]);
            qs[hash[0]] = hash[1];
        }
        return qs;
    };

    return {
        'mapInit': mapInit,
        'initializeDynamicMap': initializeDynamicMap,
        'galleryInit': galleryInit,
        'getGoogleSheetData': GetGoogleSheetData,
        'ConsumeRss': ConsumeRss,
        'LoadShop': LoadShop,
        'GalleryLoaderPreview': GalleryLoaderPreview,
        'AN_GoogleSheet': AN_GoogleSheet,
        'grabCookie': grabCookie,
        'anConsole': anConsole,
        'forceLoad': forceLoad,
        'getQS': getQS
    };

}());