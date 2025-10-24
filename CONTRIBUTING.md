# Contributing to TTB Label Verifier

Thank you for your interest in contributing to the TTB Label Verifier project!

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (browser, OS, etc.)

### Suggesting Features

Feature suggestions are welcome! Please open an issue describing:
- The proposed feature
- Use case / problem it solves
- Possible implementation approach
- Any alternatives considered

### Code Contributions

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/alcohol-label-verifier.git
   cd alcohol-label-verifier
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Test your changes thoroughly

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   ```
   
   Use conventional commit messages:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for updates to existing features
   - `Refactor:` for code refactoring
   - `Docs:` for documentation changes

5. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open a PR on GitHub

## Development Guidelines

### Code Style

- Use meaningful variable names
- Keep functions small and focused
- Add JSDoc comments for functions
- Follow React best practices
- Use functional components with hooks

### File Organization

```
components/     - Reusable React components
lib/           - Utility functions and business logic
pages/         - Next.js pages and API routes
styles/        - Global styles
public/        - Static assets
```

### Testing

Before submitting:
- Test with multiple label images
- Check responsive design
- Verify all form validation
- Test error scenarios
- Check console for errors

### Pull Request Process

1. Update README.md if needed
2. Update TESTING.md with new test cases
3. Ensure all tests pass
4. Request review from maintainers
5. Address review feedback
6. Squash commits if requested

## Priority Areas for Contribution

### High Priority
- [ ] Improve OCR accuracy
- [ ] Add unit tests
- [ ] Optimize performance
- [ ] Enhance mobile UX
- [ ] Add accessibility features

### Medium Priority
- [ ] Support for more label types (beer, wine, spirits)
- [ ] Image preprocessing
- [ ] Highlight matched text on image
- [ ] Export verification reports
- [ ] Multi-language support

### Nice to Have
- [ ] Dark mode
- [ ] Batch processing
- [ ] User accounts
- [ ] History of verifications
- [ ] API documentation

## Questions?

Feel free to open an issue for any questions about contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

Thank you for contributing! 🎉

