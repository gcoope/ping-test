# Ping Identity test

## Challenge: Interactive Skill Tree Builder

### Running instructions

```bash
npm i
npm run dev # Runs app at https://localhost:5173

# Testing
npm tun test
```

### Initial setup

Project setup using `npm create vite@latest`

Using Typescript + [React Compiler](https://react.dev/learn/react-compiler/introduction) (I've never used React Compiler before but thought this was a better time than any to try it out)

### Guidelines

- React ✓
- Built in state management ✓
- React Flow for visualisation ✓

### Requirements

- Users can add new nodes ✓
- Users can connect nodes to define prereqs ✓
- User can 'unlock' nodes if prereqs are met ✓
- Basic persistence using localStorage ✓
- Unit tested ✓
- Search/filter nodes by name ✓
- Prevent circular deps with visual feedback/validations ✓

### Bonuses / Stretch Goals

- Prevent cyclic linking (see `isChildOfNestedTarget` usage) ✓
- Search and filter ✓

### Disclosures

- Gemini used for docs/typescript clarification for React Flow
- Cursor used for:
  - Quickly installing/configuring vitest + react components (note: I did try and use Jest but it's [very awkward](https://jestjs.io/docs/getting-started#using-vite) to get working with Vite)
  - Generating the demo template in `templates.ts`

### Known bugs / Issues

- If you have 3 skills that are linked in sequence A -> B -> C that are all unlocked, and then you attach a new skill requirement (D) onto A, A will correctly update it's status but B will not. There's currently no mechanism in place to update all recursive parent/target skills
- The files/helper in `services/` aren't _really_ services but I couldn't decide where to put them. They're also missing unit tests.
- The local storage sync doesn't handle storing _no_ nodes/edges, e.g. delete all and refresh and it will load the previous state back
- I could spend many more hours styling and redesigning this so I timeboxed myself..!

### Enhancements

- Styling is very basic
- Add an layout/sort button, I saw some examples in the React Flow docs
- Improve content of a skill instead of just it's name, e.g. icon, description
- Include progress bars instead of just "Progress: x / y"

### Other

- Tree favicon from Icons8 https://icons8.com/icon/65474/tree
