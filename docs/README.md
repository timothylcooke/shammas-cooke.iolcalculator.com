# [iolcalculator.com](https://iolcalculator.com)

This repository hosts the source code of [iolcalculator.com](https://iolcalculator.com).

This is a sample website showcasing how to build an IOL calculator with a working API.

# High Level Overview

This repository ([github.com/timothylcooke/iolcalculator.com](https://github.com/timothylcooke/iolcalculator.com)) stores the code.

Any time a new commit is pushed to the repository (i.e. any time the code is changed), Cloudflare Pages automatically pulls the latest source code, builds it, tests it, and deploys it to [iolcalculator.com](https://iolcalculator.com).

# Alternative solutions

There are other options besides GitHub and Cloudflare Pages, but I use those options because they are widely used, well-documented, and are free for a high number of daily page loads. And if you end up requiring more usage than they provide for free, it is easy to scale up.

# Do it yourself

This website is intended to be a template where you can create your own working IOL calculator website with a working API.

The following is a step-by-step guide for setting up your own website with similar functionality.

## 1. Create a GitHub account

If you don't already have one, create a GitHub account at [github.com/signup](https://github.com/signup)

## 2. Copy this repository

Navigate to [github.com/new/import](https://github.com/new/import) and clone this repository to your own repository.

For the clone URL, you'll want to choose this repository's URL: `https://github.com/timothylcooke/iolcalculator.com`. 

For the owner, you'll want to pick your own account.

For the repository name, you can pick anything you want. I like to name the repository after the domain name where they are hosted, but that's just my own convention. You are free to give it whatever name you want.

You can choose to make this repository private or public. If you make it public, it means that anybody will be able to see the source code. If it's private, nobody will be able to see the source code unless you grant them access.

> **Note:** If you make the repository private, people will still be able to use your formula without being able to see how it works.

Public repositories are appropriate for open-sourced formulas, especially those that have been published in peer reviewed journals. Private repositories are acceptable if you do not want others to be able to see your formula's inner workings.

![An image that shows the settings described above](Import%20Github%20Repository.png)

Once you import this repository, you will have your own repository with a working IOL calculator API. You can customize it as much as you like, and link it up with Cloudflare Pages to have it hosted on the web.

## 3. Create a Cloudflare account

If you don't already have an account, create one at [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up/).

## 4. Set up Cloudflare Pages.

Once you're signed into Cloudflare, choose "Workers & Pages" in the navigation menu on the left.

Click on the "Pages" tab, then click "Connect to Git."

![Click "Workers & Pages", then "Pages", then "Connect to Git"](Cloudflare%20Pages.png)

[**TODO:** Presumably there is more stuff here about setting up Workers and associating GitHub]

Select your repository, and click "Begin setup"

![Select your repository within Cloudflare](Link%20the%20Repository.png)

Set up the build process.

The name can be anything you want. It's ideal to make it something easy to remember, so you can test it out before deploying to your real site.

Set the following values:

- For production branch, specify `main`.
- Framework preset should be `none`.
- Build command should be `npm run release`
- Build output directory should be `dist/prod/`
- Root directory should be `src`
- You do not need to specify any environment variables.

Click "Save and Deploy"

![Set up the Build Process](Set%20up%20Build%20Process.png)
