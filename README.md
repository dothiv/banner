# banner

The dotHIV banner project for embedding banners into any website.

## Installation

After cloning the repo, `npm install` in the repo's root directory installs all required *node* dependencies. You need to have *grunt* installed (`npm install -g grunt-cli` for system-wide installation) in order to build the files.

## Building

The banner project is configured to build four files:
 - `banner.js`, the javascript file that needs to be included into target website
 - `banner-center.html`, the HTML file that will be loaded for the *center* banner
 - `banner-top.html`, the HTML file that will be loaded for the *top* banner
 - `banner-right.html`, the HTML file that will be loaded for the *right* banner

The minified versions of these files can be built with `grunt` in the repo's root directory. An alternative, non-minified version for debugging purposes can be built with `grunt debug`. This version also generates a test page.

## Deployment

Internally, the banner project relies on resources placed in the following locations:
 - `banner.js` must be available at http://dothiv-registry.appspot.com/banner.js
 - `banner-*.html` files must be available at http://dothiv-registry.appspot.com/banner-*.html

## Configuration

Once deployed, a config object will be requested each time the banner is shown. This object must be valid JSON containing the following parameters:

### Parameters

#### status

Type: `integer` between 0 and 100

The donation status; rendered as width of the pink bar (as percentage).

#### money

Type: `string`

The current amount of donated/activated money. Decimal points must be included if desired.

#### clickcount

Type: `string`

The current count of clicks. Decimal points must be included if desired.

#### firstvisit

Type: `string` reading `center`, `top` or `right`

The position of the banner on the first visit of the target website.

#### secondvisit

Type: `string` reading `center`, `top` or `right`

The position of the banner on the second visit of the target website. This will also be used if it's the first visit but cookies are disabled.

#### heading

Type: `string`

This string will be rendered as heading of the banner.

#### subheading

Type: `string`

This string will be the subheading of the banner.

#### claim

Type: `string`

This string will be the claim of the banner.

#### about

Type: `string`

This will be the label of the *about* link.

#### vote

Type: `string`

This will be the label of the *vote* link.

#### activated

Type: `string`

This is the label on the pink bar that is prefixed to the amount of donated/activated money.

#### currency

Type: `string`

This is the currency of the shown amount of money, e.g. "Euro"

#### corresponding

Type: `string`

This is the label on the pink bar that is prefixed to the count of clicks.

#### clicks

Type: `string`

This is a suffix to the count of clicks, e.g. "Clicks"

### Example

See this sample config object for reference:

    {
     "status":25,
     "money":"736.241",
     "clickcount":"3.257.283",
     "firstvisit":"center",
     "secondvisit":"center",
     "heading":"Vielen Dank!",
     "subheading":"Dein Klick auf domain.hiv hat soeben einen Gegenwert von 1&thinsp;ct ausgel&ouml;st.",
     "claim":"Wir sind Teil der Bewegung",
     "about":"&Uuml;ber dotHIV",
     "vote":"Vote",
     "activated":"Bisher aktiviert:",
     "currency":"&euro;",
     "corresponding":"entspricht",
     "clicks":"Klicks"
    }

### Communication

Each time the target website is visited, the banner javascript sends a POST request to http://dothiv-registry.appspot.com/c. With this request, the following parameters will be transmitted:

 - `from`: possible values are `outside` or `iframe`, determining where the request was sent from
 - `firstvisit`: boolean value indicating whether this was the first visit on this website
 - `domain`: the visited domain

Thus, a complete POST request could look like this:

```
POST http://dothiv-registry.appspot.com/c?from=outside&firstvisit=false&domain=example.hiv
```

The application answering this request is expected to return a valid configuration object as described above.