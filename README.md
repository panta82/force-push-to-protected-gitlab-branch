# force-push-to-protected-gitlab-branch

### Usage

```
npx force-push-to-protected-gitlab-branch
```
or
```
npm install --global force-push-to-protected-gitlab-branch
force-push-to-protected-gitlab-branch
```

### Instructions

This simple helper will remove the protected status from your current gitlab branch, push, then immediately restore it.
You will need to provide your private gitlab access token in one of 3 ways:
- interactively
- by providing PRIVATE_ACCESS_TOKEN=xxx environment variable
- by configuring it in the settings file (see [settings.example.json](./settings.example.json) for example file structure).

Settings file location is:
- `$HOME/.force-push-to-protected-gitlab-branch-settings.json`, if using with `npx`
- `settings.json` in the root of this project, if using with `npm install --global`
 
If you paste the env interactively, you will be prompted to save it at the correct location, so that's the recommended workflow.

If your current branch isn't protected, we will abort. To push anyway and then protect it, call with the `--force` flag.

### Dev

There are intentionally no dependencies. Just clone and dev.

### Licence

MIT
