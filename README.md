# force-push-to-protected-gitlab-branch

### Usage

```
npx force-push-to-protected-gitlab-branch
```

### Instructions

This simple helper will remove the protected status from your current gitlab branch, pushes, then immediately restores it.
You will need to provide your private gitlab access token in one of 3 ways:
- by setting it as PRIVATE_ACCESS_TOKEN=xxx env
- by configuring it in `settings.json`, in the root of the project
- interactively

If you paste the env interactively, you will be prompted to save it, so that's the recommended workflow.

If your current branch isn't protected, we will abort. To push anyway and then protect it, call with the `--force` flag.

### Dev

There are intentionally no dependencies. Just clone and dev.

### Licence

MIT
