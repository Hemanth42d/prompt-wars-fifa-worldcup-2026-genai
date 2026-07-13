# Contributing to FIFA World Cup 2026 GenAI Stadium Assistant

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install && cd client && npm install`
4. Create a branch: `git checkout -b feature/your-feature`
5. Make your changes
6. Run tests: `npm test`
7. Commit changes: `git commit -m "feat: your feature"`
8. Push to your fork: `git push origin feature/your-feature`
9. Create a Pull Request

## Coding Standards

### JavaScript/Node.js
- Follow ESLint rules (see `.eslintrc.js`)
- Use async/await over callbacks
- Add JSDoc comments for functions
- Write meaningful variable names
- Keep functions under 50 lines

### React
- Use functional components with hooks
- Add PropTypes or TypeScript types
- Follow accessibility guidelines (WCAG 2.1)
- Use semantic HTML
- Add ARIA labels where needed

### Testing
- Write tests for new features
- Maintain >90% code coverage
- Test edge cases and error scenarios
- Use descriptive test names

## Commit Message Format

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test updates
- `refactor:` Code refactoring
- `style:` Code style changes
- `chore:` Build/config changes

Example: `feat: add voice interaction support`

## Pull Request Process

1. Update README.md if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update documentation
5. Request review from maintainers

## Questions?

Open an issue for questions or discussions.

Thank you for contributing! 🎉
