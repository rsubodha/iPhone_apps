/* 	Google+ Activity Widget v1.0
Blog : http://www.moretechtips.net
Project: http://code.google.com/p/googleplus-activity-widget/
Copyright 2009 [Mike @ moretechtips.net] 
Licensed under the Apache License, Version 2.0 
(the "License"); you may not use this file except in compliance with the License. 
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
*/
(function (f) {
    f.fn.googlePlusActivity = function (k) {
        k = f.extend({}, f.fn.googlePlusActivity.defaults, k); return this.each(function () {
            var g = f(this), h = null, l = null, c = k, r = function (a) {
                a.error ? c.debug && g.html('<b style="color:red">Error: ' + a.error.message + "</b>") : a.displayName && (l = f('<div class="gpaw-profile"></div>').prependTo(g), l.html((a.image ? '<a href="' + a.url + '" class="avatar"><img src="' + q(a.image.url, { sz: c.avatar_max }) + '" /></a>' : "") + '<div class="name">' + a.displayName + '</div><a href="' + a.url + '" class="add">Add to circles</a>'),
o())
            }, q = function (a, b) { var d = a + (0 > a.indexOf("?") ? "?" : "&"), c = !0, f; for (f in b) c || (d += "&"), d = d + f + "=" + encodeURIComponent(b[f]), c = !1; return d }, v = function (a) {
                if (a.error) c.debug && g.html('<b style="color:red">Error: ' + a.error.message + "</b>"); else if (a.items) {
                    var b = a.items.length; if (0 != b) {
                        h = f('<ul class="gpaw-body" style="height:' + c.body_height + 'px"></ul>'); l ? h.insertAfter(l) : h = h.prependTo(g); h.append('<div class="fade"></div>'); for (b -= 1; 0 <= b; b--) {
                            var d = a.items[b], s = d.object.replies ? d.object.replies.totalItems :
0, k = d.object.plusoners ? d.object.plusoners.totalItems : 0, t = d.object.resharers ? d.object.resharers.totalItems : 0, e; e = { src: "", imgLink: "", useLink: "", useTitle: "" }; var m = d.object.attachments; if (m && m.length) {
                                for (var j = 0; j < m.length; j++) { var i = m[j]; i.image && (e.src = i.image.url, e.imgLink = i.url, i.fullImage && (e.w = i.fullImage.width || 0, e.h = i.fullImage.height || 0)); "article" == i.objectType && (e.useLink = i.url); i.displayName && (e.useTitle = i.displayName) } e.useLink || (e.useLink = e.imgLink); 0 <= e.src.indexOf("resize_h") && (e.src =
e.w >= e.h ? e.src.replace(/resize_h=\d+/i, "resize_h=" + c.image_height) : e.src.replace(/resize_h=\d+/i, "resize_w=" + c.image_width))
                            } h.append("<li>" + (c.show_image && e.src ? '<span class="thumb" style="width:' + (c.image_width + 2) + "px; height:" + (c.image_height + 2) + 'px; overflow:hidden">' + (e.useLink ? '<a href="' + e.useLink + '">' : "") + '<img src="' + e.src + '" />' + (e.useLink ? "</a>" : "") + "</span>" : "") + '<span class="title">' + (e.useLink ? '<a href="' + e.useLink + '">' : "") + (d.title ? d.title : e.useTitle) + (e.useLink ? "</a>" : "") + '</span><span class="meta">' +
(c.show_plusones ? '<span class="plusones">+' + n(k) + "</span>" : "") + (c.show_shares ? '<span class="shares">' + n(t) + " shares</span>" : "") + (c.show_replies ? '<span class="replies">' + n(s) + " comments</span>" : "") + (c.show_date ? '<a class="date" href="' + d.url + '">' + u(d.published) + "</a>" : "") + "</span></li>")
                        } o(); c.rotate && p()
                    } 
                } 
            }, n = function (a) { var b = a; 999999 < a ? b = Math.floor(a / 1E6) + "M" : 9999 < a ? b = Math.floor(a / 1E3) + "K" : 999 < a && (b = Math.floor(a / 1E3) + "," + a % 1E3); return b }, u = function (a) {
                var b = a; if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d*)?(Z|[+-]\d{2}:\d{2})$/i.test(b)) {
                    var a =
b.slice(0, 4), d = ",Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(",")[1 * b.slice(5, 7)], c = b.slice(8, 10), f = b.slice(11, 13), g = b.slice(14, 16), e = b.slice(17, 19), h = "GMT"; if (-1 == b.indexOf("Z")) var j = b.lastIndexOf(":"), h = h + (b.slice(j - 3, j) + b.slice(j + 1)); a = c + " " + d + " " + a + " " + f + ":" + g + ":" + e + " " + h
                } else a = ""; b = new Date; b.setTime(Date.parse(a)); a = "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","); d = Math.floor((new Date - b) / 1E3); 0 > d && (d = 0); return 60 > d ? d + " seconds ago" : 60 > d / 60 ? Math.floor(d / 60) + " minutes ago" :
24 > d / 60 / 60 ? Math.floor(d / 60 / 60) + " hours ago" : a[b.getMonth()] + " " + b.getDate() + ", " + b.getFullYear()
            }, p = function () { var a = f("li", h), b = a.size(); if (!(1 >= b)) { var d = a.eq(0), g = a.eq(b - 1); g.css({ display: "none", visibility: "hidden" }).remove().insertBefore(d); g.animate({ height: "show" }, c.slide_time, "linear", function () { g.css({ display: "none", visibility: "visible" }); f(this).fadeIn(c.fade_time, w) }) } }, w = function () { h.animate({ opacity: 1 }, c.stay_time, "linear", p) }, o = function () { f(".gpaw-info", g).show().css("display", "block") };
            (function () {
                var a = g.attr("data-options"); if (!a) { var b = g.html().replace(/\n|\r\n/g, ""); b && (b = b.match(/<\!--\s*(\{.+\});?\s*--\>/)) && 2 == b.length && (a = b[1]) } if (a) { 0 > a.indexOf("{") && (a = "{" + a + "}"); try { c = eval("(" + a + ")") } catch (d) { g.html('<b style="color:red">' + d + "</b>"); return } c = f.extend({}, f.fn.googlePlusActivity.defaults, c) } !c.user && c.debug && g.html('<b style="color:red">user ID was not set!</b>'); f.ajax({ url: "https://www.googleapis.com/plus/v1/people/" + c.user + "/activities/public", data: { key: c.api_key, maxResults: c.n,
                    prettyprint: !1, fields: "items(id,kind,object(attachments(displayName,fullImage,id,image,objectType,url),id,objectType,plusoners,replies,resharers,url),published,title,url,verb)"
                }, success: v, cache: !0, dataType: "jsonp"
                }); c.show_profile && f.ajax({ url: "https://www.googleapis.com/plus/v1/people/" + c.user, data: { key: c.api_key, prettyprint: !1, fields: "displayName,image,tagline,url" }, success: r, cache: !0, dataType: "jsonp" })
            })()
        })
    }; f.fn.googlePlusActivity.defaults = { debug: 0, api_key: "AIzaSyClQAmy0Qt8cC72Zi2TfwHF2GyVy9NVtDA",
        user: "", n: 20, rotate: 1, stay_time: 5E3, slide_time: 200, fade_time: 500, show_profile: 1, show_date: 1, show_replies: 1, show_plusones: 1, show_shares: 1, show_image: 1, image_width: 75, image_height: 75, avatar_max: 50, body_height: 300
    }
})(jQuery);
