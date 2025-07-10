# Contributing to FluxGen

We love your input! We want to make contributing to FluxGen as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

### Development Setup

1. **Clone your fork**
   ```bash
   git clone https://github.com/YatharthSanghavi/fluxgen.git
   cd fluxgen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm run test
   ```

5. **Run linting**
   ```bash
   npm run lint
   ```

## Code Style

- We use ESLint and Prettier for code formatting
- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Component Guidelines

- Use functional components with hooks
- Implement proper TypeScript types
- Follow the existing folder structure
- Use Tailwind CSS for styling
- Ensure responsive design

### File Organization

```
src/
├── components/
│   ├── admin/           # Admin-specific components
│   ├── common/          # Reusable components
│   ├── docs/            # Documentation components
│   ├── forms/           # Form components
│   └── gallery/         # Gallery components
├── hooks/               # Custom React hooks
├── types/               # TypeScript definitions
├── constants/           # App constants
└── utils/               # Utility functions
```

## Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/yourusername/fluxgen/issues).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

We welcome feature requests! Please:

1. Check if the feature has already been requested
2. Provide a clear description of the feature
3. Explain why this feature would be useful
4. Consider providing a basic implementation plan

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement

Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.

## Getting Help

- Check the [documentation](/README.md)
- Look through existing [issues](https://github.com/YatharthSanghavi/fluxgen/issues)
- Join our [discussions](https://github.com/yourusername/fluxgen/discussions)

## Recognition

Contributors will be recognized in our README and release notes. We appreciate all contributions, no matter how small!

---

Thank you for contributing to FluxGen! 🎨✨
