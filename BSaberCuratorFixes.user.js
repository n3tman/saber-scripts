// ==UserScript==
// @name         BSaber Curator Fixes
// @namespace    bsaber.com
// @version      0.1
// @description  Adds Now button when editing posts, highlights required categories
// @author       n3tman
// @match        https://bsaber.com/wp-admin/post.php?*action=edit*
// @icon         https://www.google.com/s2/favicons?domain=bsaber.com
// @updateURL    https://n3tman.github.io/saber-scripts/BSaberCuratorFixes.user.js
// @downloadURL  https://n3tman.github.io/saber-scripts/BSaberCuratorFixes.user.js
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('#category-35042, #category-35038, #post_author_override { background-color: rgb(185 243 178 / 40%); }');

    document.querySelector('.curshares').insertAdjacentHTML(
        'beforebegin',
        '<div class="misc-pub-section"><button class="button" id="now-btn">Bump to Now</button></div>'
    );

    document.querySelector('#now-btn').addEventListener('click', function(e) {
        e.preventDefault();

        var options = {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit',
            hour12: false,
            timeZone: 'America/New_York'
        };
        var parts = new Intl.DateTimeFormat('en-US', options).formatToParts(new Date());

        document.querySelector('.edit-timestamp').click();

        document.querySelector('#mm').value = parts[0].value; // month
        document.querySelector('#jj').value = parts[2].value; // day
        document.querySelector('#aa').value = parts[4].value; // year
        document.querySelector('#hh').value = parts[6].value; // hour
        document.querySelector('#mn').value = parts[8].value; // minute
    });
})();
