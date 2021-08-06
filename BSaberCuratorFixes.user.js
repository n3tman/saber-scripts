// ==UserScript==
// @name         BSaber Curator Fixes
// @namespace    bsaber.com
// @version      0.3
// @description  Adds Now button when editing posts, highlights required categories
// @author       n3tman
// @match        https://bsaber.com/wp-admin/post.php?*action=edit*
// @icon         https://www.google.com/s2/favicons?domain=bsaber.com
// @updateURL    https://n3tman.github.io/saber-scripts/BSaberCuratorFixes.user.js
// @downloadURL  https://n3tman.github.io/saber-scripts/BSaberCuratorFixes.user.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.beatsaver.com
// ==/UserScript==

var userAgent = 'BSaberCuratorFixes/0.3 (+https://github.com/n3tman/saber-scripts)';

GM_addStyle('#category-35042, #category-35038, #post_author_override, .button.hl { background-color: rgb(185 243 178 / 40%); }');

function setBsaberDateTime(dateTime) {
    var options = {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
        hour12: false,
        timeZone: 'America/New_York'
    };
    var parts = new Intl.DateTimeFormat('en-US', options).formatToParts(dateTime);

    document.querySelector('.edit-timestamp').click();

    document.querySelector('#mm').value = parts[0].value; // month
    document.querySelector('#jj').value = parts[2].value; // day
    document.querySelector('#aa').value = parts[4].value; // year
    document.querySelector('#hh').value = parts[6].value; // hour
    document.querySelector('#mn').value = parts[8].value; // minute
}

function getBeatSaverData(mapKey, callback) {
    var apiUrl = 'https://api.beatsaver.com/maps/id/' + mapKey;

    GM_xmlhttpRequest({
        method: 'GET',
        url: apiUrl,
        headers: {
            'User-Agent': userAgent
        },
        onload: function(response) {
            callback(JSON.parse(response.responseText));
        },
        onerror: function(response) {
            alert('Error: ' + response.responseText);
        }
    });
}

function getPageKey() {
    var link = document.querySelector('#sample-permalink');
    if (link) {
        return link.href.split('/')[4];
    }
}

(function() {
    'use strict';

    // Remove default Now button (not needed with userscript)
    var nativeBtn = document.querySelector('.now.button');
    if (nativeBtn) {
        nativeBtn.remove();
    }

    // Insert new custom buttons
    document.querySelector('.curshares').insertAdjacentHTML(
        'beforebegin',
        '<div class="misc-pub-section"><button class="button hl" id="bump-btn">Bump!</button>' +
        '<button class="button hl" id="reset-btn" style="margin-left: 10px">Orig Date</button>' +
        '<button class="button hl" id="insert-btn" style="margin-left: 10px">Insert Orig</button></div>'
    );

    // Bump button
    document.querySelector('#bump-btn').addEventListener('click', function(e) {
        e.preventDefault();

        setBsaberDateTime(new Date());
    });

    // Reset button
    document.querySelector('#reset-btn').addEventListener('click', function(e) {
        e.preventDefault();

        var key = getPageKey();

        getBeatSaverData(key, function(data) {
            if (data.uploaded) {
                setBsaberDateTime(new Date(data.uploaded));
            }
        });
    });

    // Insert button
    document.querySelector('#insert-btn').addEventListener('click', function(e) {
        e.preventDefault();

        var key = getPageKey();

        getBeatSaverData(key, function(data) {
            if (data.uploaded) {
                var dateString = new Date(data.uploaded).toLocaleDateString('en-US', {dateStyle: 'medium'});
                var prepend = '<p><strong>Uploaded on:</strong> ' + dateString + ' <em>(bumped)</em></p>\n';

                // Switch to Classic Mode
                var compMode = document.querySelector('.composer-switch');
                if (compMode.classList.contains('vc_backend-status')) {
                    document.querySelector('.wpb_switch-to-composer').click();
                }

                // Switch to Text Mode
                var wysiMode = document.querySelector('#wp-content-wrap');
                if (wysiMode.classList.contains('tmce-active')) {
                    document.querySelector('#content-html').click();
                }

                // Prepend original date to text
                var textarea = document.querySelector('#content');
                if (textarea) {
                    textarea.value = prepend + textarea.value;
                }
            }
        });
    });
})();
