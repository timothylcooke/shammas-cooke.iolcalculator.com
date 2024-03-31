# [iolcalculator.com](https://iolcalculator.com)

This repository hosts the source code of [iolcalculator.com](https://iolcalculator.com).

This is a sample website showcasing how to build an IOL calculator with a working API.

# High Level Overview

This repository ([github.com/timothylcooke/iolcalculator.com](https://github.com/timothylcooke/iolcalculator.com)) stores the code.

Any time a new commit is pushed to the repository (i.e. any time the code is changed), Cloudflare Pages automatically fetches the latest source code from GitHub, builds it, runs tests, and (assuming the tests pass) deploys the compiled code to [iolcalculator.com](https://iolcalculator.com).

# Alternative solutions

There are other options besides GitHub and Cloudflare Pages, but I use those options because they are widely used, well-documented, and are free for a high number of daily page loads. If you end up requiring more usage than they provide for free, it is cheap and easy to scale up.

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

Public repositories are appropriate for open-sourced formulas, especially those that have been published in peer-reviewed journals. Private repositories are preferable if you do not want others to be able to see your formula's inner workings.

![An image that shows the settings described above](Import%20Github%20Repository.png)

Once you import this repository, you will have your own repository with a working IOL calculator API. You can customize it as much as you like, and link it up with Cloudflare Pages to have it hosted on the web.

## 3. Create a Cloudflare account

If you don't already have an account, create one at [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up/).

## 4. Set up Cloudflare Pages.

Once you're signed into Cloudflare, choose "Workers & Pages" in the navigation menu on the left.

Click on the "Pages" tab, then click "Connect to Git."

![Click "Workers & Pages", then "Pages", then "Connect to Git"](Cloudflare%20Pages.png)

![Click "Connect to GitHub"](Connect%20GitHub.png)

If you're not already signed in, you may be prompted to sign in.

Click "Only select repositories" and select your now repository. Then click "Install & Authorize." This will link your Cloudflare account to your GitHub account, and will grant Cloudflare access to download the source code.

![This image shows the settings you need to pick when installing Cloudflare to your GitHub account.](Link%20Cloudflare%20&%20GitHub.png)

Select your repository, and click "Begin setup"

![Select your repository within Cloudflare](Link%20the%20Repository.png)

Next, you'll need to Set up the build process.

The project name can be anything you want. It's ideal to make it something easy to remember, so you can test it out before deploying to your real site.

Set the following values:

- For production branch, specify `main`.
- Framework preset should be `None`.
- Build command should be `npm run release`
- Build output directory should be `dist/prod/`
- Root directory should be `src`
- You do not need to specify any environment variables.

Click "Save and Deploy"

![This image shows all of the settings described above](Set%20up%20Build%20Process.png)

This will start the process of building and deploying the website. After a couple minutes, it should successfully deploy. 

By default, Cloudflare will deploy the website to a workers.dev domain. However, you can switch to the "Custom domains" tab if you want to set up this site to work on your own domain. This will require moving your domain's DNS to Cloudflare at a minimum, and transferring your domain to Cloudflare at a maximum. Migrating a domain to Cloudflare is beyond the scope of this guide.

![Set up a custom domain Button](Custom%20Domains.png)

While it's not strictly necessary, you'll probably want to add a custom domain. Type the name of the website you want to have host the code and click "Continue."

![Add a Custom Domain](Add%20a%20Custom%20Domain.png)

When you click "Activate domain," Cloudflare will automatically add a CNAME for you.

![Activate the Custom Domain](Activate%20the%20Custom%20Domain.png)

Now your website is available on both pages.dev _and_ your custom domain. If you want, you can set up the pages.dev domain to redirect to your custom domain. Pick any name and description (e.g. "url_redirects" and "Redirect URLs"). You'll want to manually add a redirect to redirect from your pages.dev domain to your custom domain. The target URL should start with `https://`, any status is fine, and you'll want to check all four parameter options.

![Where to create a Bulk Redirect](Bulk%20Redirects.png)
![The settings to use for redirections](Manual%20Redirect%20Settings.png)

# Customize the site

If you're already familiar with Git and Node, you can use any tools you want to download, edit, debug, and publish changes to the source code.

If you're not familiar, I recommend using:
1. [Sourcetree](https://www.sourcetreeapp.com/) to download the source code and commit changes, and:
2. [Visual Studio Code](https://code.visualstudio.com/download) to edit the code.

## Download the Source Code

You'll want to download the source code to your local PC. From your GitHub page, find your repository. Click the "Code" button to copy the URL for your repository.

![Repository Link](Get%20Repository%20Link.png)

Next, open Sourcetree and Clone the source code to your PC by pasting the link you got from GitHub. You can save it anywhere on your PC.

![Clone the Repository in Sourcetree](Clone%20Repository.png)

Next, you'll want to switch to Visual Studio Code and open the code you just downloaded. Open Folder and browse to the the folder you just downloaded.

![Open Folder and choose the folder you just downloaded](Open%20Folder.png)

You can run the code in Visual Studio by switching to the "Run and Debug" tab and click the "Play" button while the ComboBox shows "Install Packages." This installs all Node packages required to build and debug the source code.

![Install Packages](Install%20Packages.png)

Once it finishes installing packages, you can change the option to "Debug Locally" and click "Run" again.

![Debug Locally](Debug%20Locally.png)

This opens up a terminal. If you click the terminal and type the letter "B," it should open a browser and run your locally-running source code.

Now, you can make changes in Visual Studio Code and those changes will show up in the browser when you refresh the page.

If you search for TODO, it shows places in the source code that I've identified as being most likely to need to change to accomodate another IOL formula.

![Search for TODO](Search%20for%20TODO.png)

Once you've made changes, you can load them locally in the browser. Once you're happy with your changes, you can use Sourcetree to commit and push them to GitHub. As soon as you push changes, Cloudflare will download the latest changes and update your site.