# force-push-to-protected-gitlab-branch

This simple helper will remove the protected status from your current gitlab branch, pushes, then immediately restores it.
You will need to provide your private gitlab access token in one of 3 ways:
- by setting it as PRIVATE_ACCESS_TOKEN=xxx env
- by placing it under "PRIVATE_ACCESS_TOKEN" in .env file, at the root of this project
- interactively
