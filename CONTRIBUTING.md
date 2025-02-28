# Contributing to deezer-ts

Thank you for your interest in contributing to deezer-ts! We welcome contributions from the community and are grateful for any time you're willing to contribute.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct, which is to:
- Be respectful of all contributors
- Use welcoming language
- Be collaborative and constructive in discussions
- Focus on what is best for the community

## Getting Started

1. **Fork the Repository**
   - Fork the repository on GitHub
   - Clone your fork locally: `git clone https://github.com/your-username/deezer-ts.git`
   - Add upstream remote: `git remote add upstream https://github.com/GuiEpi/deezer-ts.git`

2. **Set Up Development Environment**
   - Install Node.js (version >= 16)
   - Install pnpm: `npm install -g pnpm`
   - Install dependencies: `pnpm install`
   - Build the project: `pnpm build`
   - Run tests: `pnpm test`

## Development Workflow

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Your Changes**
   - Write clean, maintainable, and typed code
   - Follow the existing code style and conventions
   - Add or update tests as needed
   - Update documentation if required

3. **Test Your Changes**
   - Run the test suite: `pnpm test`
   - Run specific test files: `pnpm test path/to/test-file.test.ts`
   - Check test coverage: `pnpm test:coverage`
   - Ensure your changes don't decrease coverage
   - Run tests in watch mode during development: `pnpm test:watch`

4. **Commit Your Changes**
   - Use clear and meaningful commit messages
   - Format: `type(scope): description`
   - Examples:
     ```
     feat(client): add new search parameters
     fix(pagination): resolve async iterator issue
     docs(readme): update installation instructions
     ```

5. **Submit a Pull Request**
   - Push your changes to your fork
   - Create a pull request from your fork to the main repository
   - Fill out the pull request template completely
   - Link any related issues

## Code Standards

### TypeScript Guidelines
- Use TypeScript strict mode
- Provide complete type definitions
- Avoid using `any` type
- Document public APIs using JSDoc comments

### Testing
- Write unit tests for new features
- Ensure all tests pass before submitting
- Maintain or improve code coverage
- Test both success and error cases
- Mock external API calls in tests
- Use descriptive test names that explain the expected behavior

### Documentation
- Update documentation for new features or changes
- Include JSDoc comments for public APIs
- Update README.md if needed
- Add examples for new functionality

## Pull Request Process

1. **Before Submitting**
   - Ensure all tests pass: `pnpm test`
   - Update documentation as needed
   - Add or update test cases
   - Run `pnpm lint` and fix any issues
   - Run `pnpm build` to ensure compilation succeeds

2. **Review Process**
   - PRs require at least one maintainer review
   - Address review feedback promptly
   - Keep PRs focused and reasonable in size

3. **After Merging**
   - Delete your branch
   - Keep your fork synced with upstream

## Release Process

Releases are handled by the maintainers. They follow semantic versioning:
- MAJOR version for incompatible API changes
- MINOR version for backwards-compatible functionality
- PATCH version for backwards-compatible bug fixes

## Getting Help

If you need help, you can:
- Open an issue with a clear description
- Tag your issue appropriately
- Provide reproduction steps for bugs

## License

By contributing to deezer-ts, you agree that your contributions will be licensed under its MIT license. 