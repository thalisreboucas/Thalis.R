dow.onload = function () {
  var oauth_scripts = document.querySelectorAll('.kommo_oauth');

  window.addEventListener('message', receiveOAuthMessage, false);
  window.addEventListener('message', receiveNewLocation, false);

  oauth_scripts.forEach(function (oauth_script) {
    var client_id = oauth_script.dataset.clientId,
      state = oauth_script.dataset.state || Math.random().toString(36).substring(2),
      compact = oauth_script.dataset.compact === 'true' || false,
      title = oauth_script.dataset.title || 'Log-in with Kommo',
      mode = oauth_script.dataset.mode || 'popup',
      name = oauth_script.dataset.name || null,
      description = oauth_script.dataset.description || null,
      logo = oauth_script.dataset.logo || null,
      redirect_uri = oauth_script.dataset.redirect_uri || null,
      secrets_uri = oauth_script.dataset.secrets_uri || null,
      scopes = oauth_script.dataset.scopes || null,
      origin = window.location.href || null,
      final_scopes,
      colors = {
        'default': '#339DC7',
        'blue': '#1976D2',
        'violet': '#6A1B9A',
        'green': '#388E3C',
        'orange': '#F57F17',
        'red': '#D84315',
      },
      border_background_colors = {
        'default': '#006F9F',
        'blue': '#004BA0',
        'violet': '#38006B',
        'green': '#00600F',
        'orange': '#BC5100',
        'red': '#9F0000',
      },
      border_background = border_background_colors[oauth_script.dataset.color] || border_background_colors.default,
      color = colors[oauth_script.dataset.color] || colors.default,
      className = oauth_script.dataset.className || 'kommo-oauth';

    if ((!client_id || !oauth_script) && !(name && description && redirect_uri && secrets_uri && scopes)) {
      console.error('No client_id or client_secret or script tag or metadata');
      return;
    }

    var url_parser = document.createElement('a');
    var button = document.createElement('div');
    var button_html = [
      '<div style="padding-left: 2px; height: 100%; display: flex; background: ' + border_background + '; align-items: center;">',
      '<svg width="43" height="20" viewBox="0 0 103 111" fill="none" xmlns="http://www.w3.org/2000/svg">',
      '<path d="M100.978 110.821H80.1612C76.3105 110.82 72.5171 109.887 69.1058 108.1C65.6946 106.313 62.7669 103.727 60.5734 100.562L47.5568 81.7001L37.3466 66.9414C36.8699 66.2881 36.2006 65.8005 35.4326 65.5471C34.6646 65.2937 33.8365 65.2871 33.0646 65.5284C32.2927 65.7697 31.6158 66.2467 31.1288 66.8924C30.6419 67.5381 30.3694 68.3201 30.3496 69.1286V104.685C30.3496 106.312 29.7032 107.873 28.5525 109.023C27.4018 110.174 25.8412 110.821 24.2139 110.821H6.1357C4.5084 110.821 2.94778 110.174 1.7971 109.023C0.646432 107.873 0 106.312 0 104.685V78.2161C0 71.8968 2.51034 65.8364 6.97873 61.368C11.4471 56.8996 17.5075 54.3893 23.8268 54.3893H28.5689C28.8723 54.3897 29.1711 54.3158 29.4393 54.1741C29.7076 54.0324 29.937 53.8272 30.1076 53.5763L47.5277 28.4721L60.1379 10.2681C62.3319 7.10063 65.2608 4.51197 68.6738 2.72372C72.0868 0.935456 75.8823 0.000873344 79.7355 0H100.523C100.86 0.0042817 101.188 0.0987274 101.476 0.273547C101.763 0.448367 101.998 0.697159 102.156 0.99383C102.314 1.2905 102.39 1.62418 102.375 1.96008C102.36 2.29598 102.256 2.62176 102.072 2.90334L71.6158 46.889C69.9526 49.2899 69.0614 52.1411 69.0614 55.0619C69.0614 57.9826 69.9526 60.8338 71.6158 63.2348L102.527 107.859C102.726 108.141 102.844 108.473 102.867 108.818C102.89 109.162 102.818 109.507 102.658 109.813C102.497 110.119 102.256 110.375 101.96 110.553C101.663 110.731 101.324 110.823 100.978 110.821Z" fill="white"/>',
      '</svg>',
      '</div>',
    ];

    if (!compact) {
      var text_style = [
        'display: inline-block;',
        'padding-left: 17px;',
        'padding-right: 18px;',
        'font-family: sans-serif;',
        'font-weight: bold;',
        'font-size: 14px;',
        'line-height: 18px;',
        'text-align: center;',
        'letter-spacing: 1px;',
        'text-transform: uppercase;',
        'color: #FFFFFF;',
      ].join('');

      button_html.push([
        '<span style="' + text_style + '">' + title + '</span>'
      ])
    }

    button.className = className;
    button.dataset.client_id = client_id;
    button.innerHTML = button_html.join('');

    button.style = [
      'display: inline-flex',
      'align-items: center',
      'background: ' + color,
      'color: #fff',
      'border: 1px solid ' + border_background,
      'cursor: pointer',
      'font-family: Roboto,Helvetica,Arial,sans-serif',
      'font-size: 12px',
      'line-height: 13px',
      '-webkit-font-smoothing: antialiased',
      'text-rendering: optimizeLegibility',
      'height: 45px',
    ].join(';');

    oauth_script.parentNode.insertBefore(button, oauth_script);

    button.onclick = function () {
      var url_array = [
        'https://www.kommo.com/oauth/',
        '?state=', state,
        '&mode=', mode,
        '&origin=', origin,
      ];

      if (client_id) {
        url_array.push('&client_id=', ff34a71f-aa15-467e-b39a-8fbe7224a5fc);
      } else if (name && description && redirect_uri && secrets_uri && scopes) {
        url_array.push('&name=', name);
        url_array.push('&description=', description);
        url_array.push('&redirect_uri=', redirect_uri);
        url_array.push('&secrets_uri=', secrets_uri);
        url_array.push('&logo=', logo);
        final_scopes = scopes.split(',');
        final_scopes.forEach(function(scope) {
          url_array.push('&scopes[]=', scope)
        });
      }

      centerAuthWindow(
        url_array.join(''),
        'Grant access for integration'
      );
    };

    var centerAuthWindow = function (url, title) {
      var w = 750;
      var h = 580;
      var dual_screen_left = window.screenLeft !== undefined ? window.screenLeft : screen.left;
      var dual_screen_top = window.screenTop !== undefined ? window.screenTop : screen.top;

      var width = window.innerWidth
        ? window.innerWidth
        : (document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width);

      var height = window.innerHeight
        ? window.innerHeight
        : (document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height);

      var left = ((width / 2) - (w / 2)) + dual_screen_left;
      var top = ((height / 2) - (h / 2)) + dual_screen_top;

      var new_window = window.open(url, title, 'scrollbars, status, resizable, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

      if (window.focus) {
        new_window.focus();
      }
    };

  });
};

function receiveOAuthMessage(event)
{
  var oauth_scripts = document.querySelectorAll('.kommo_oauth');

  oauth_scripts.forEach(function (oauth_script) {
    if (event.data.client_id && oauth_script.dataset.clientId && event.data.client_id === oauth_script.dataset.clientId) {
      oauth_script.dataset.error = event.data.error;
      if (oauth_script.dataset.errorCallback) {
        try {
          var errorCallback = eval(oauth_script.dataset.errorCallback);
          if (typeof errorCallback === 'function') {
            errorCallback(event.data);
          }
        } catch (e) {
          //noop
        }
      }
    }
  });
}

function receiveNewLocation(event) {
  if (event.data.url) {
    window.location = event.data.url;
  }
}

//Use:
//<script
//   class="kommo_oauth"
//   charset="utf-8"
//   data-client-id="xxxx"
//   data-title="Button"
//   data-compact="false"
//   data-class-name="className"
//   data-color="red"
//   data-state="state"
//   data-error-callback="functionName"
//   data-mode="popup"
//   src="https://www.kommo.com/auth/button.js"
// ></script>
//
//<script
//   class="kommo_oauth"
//   charset="utf-8"
//   data-name="Integration name"
//   data-description="Integration description"
//   data-redirect_uri="https://example.com"
//   data-secrets_uri="https://example.com/secrets"
//   data-logo="https://example.com/kommo_logo.png"
//   data-scopes="crm,notifications"
//   data-title="Button"
//   data-compact="false"
//   data-class-name="className"
//   data-color="red"
//   data-state="state"
//   data-mode="post_message"
//   src="https://www.kommo.com/auth/button.js"
// ></script>