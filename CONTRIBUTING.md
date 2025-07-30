# Contributing

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project.

## Development workflow

To get started with the project, run `npm install` in the root directory to install the required dependencies for each package:

```sh
npm install
```

While developing, you can run the [example app](/example/) to test your changes.


Make sure your code passes TypeScript and ESLint. Run the following to verify:

```sh
npm run lint
```

Remember to add tests for your change if possible. Run the unit tests by:

```sh
npm run test
```

To edit the Objective-C files, open `example/ios/HceExample.xcworkspace` in XCode and find the source files at `Pods > Development Pods > react-native-hce`.

To edit the Kotlin files, open `example/android` in Android studio and find the source files at `reactnativehce` under `Android`.

### Commit message convention

We follow the [conventional commits specification](https://www.conventionalcommits.org/en) for our commit messages:

- `fix`: bug fixes, e.g. fix crash due to deprecated method.
- `feat`: new features, e.g. add new method to the module.
- `refactor`: code refactor, e.g. migrate from class components to hooks.
- `docs`: changes into documentation, e.g. add usage example for the module..
- `test`: adding or updating tests, eg add integration tests using detox.
- `chore`: tooling changes, e.g. change CI config.

Our pre-commit hooks verify that your commit message matches this format when committing.

### Sending a pull request

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Verify that linters and tests are passing.
- Review the documentation to make sure it looks good.
- Follow the pull request template when opening a pull request.
- For pull requests that change the API or implementation, discuss with maintainers first by opening an issue.
