import * as fs from 'fs';
import * as path from 'path';

const WORKFLOW_PATH = path.join(__dirname, '../../.github/workflows/governance-gates.yml');

describe('governance-gates.yml workflow configuration', () => {
  let content: string;

  beforeAll(() => {
    content = fs.readFileSync(WORKFLOW_PATH, 'utf8');
  });

  describe('workflow file exists and is readable', () => {
    test('workflow file exists', () => {
      expect(fs.existsSync(WORKFLOW_PATH)).toBe(true);
    });

    test('workflow file is non-empty', () => {
      expect(content.trim().length).toBeGreaterThan(0);
    });
  });

  describe('workflow name', () => {
    test('workflow is named "Governance Gates"', () => {
      expect(content).toMatch(/^name:\s*Governance Gates\s*$/m);
    });
  });

  describe('trigger events', () => {
    test('triggers on pull_request events', () => {
      expect(content).toMatch(/pull_request/);
    });

    test('triggers on push events', () => {
      expect(content).toMatch(/push/);
    });

    test('push trigger is scoped to the main branch', () => {
      expect(content).toMatch(/branches:\s*\[\s*main\s*\]/);
    });
  });

  describe('gates job reusable workflow reference', () => {
    test('gates job exists', () => {
      expect(content).toMatch(/^\s*gates:/m);
    });

    test('uses the canonical external reusable workflow', () => {
      expect(content).toContain(
        'uses: CHITTYOS/chittycommand/.github/workflows/reusable-governance-gates.yml@main'
      );
    });

    test('references the CHITTYOS org and chittycommand repo', () => {
      expect(content).toMatch(/uses:\s*CHITTYOS\/chittycommand\//);
    });

    test('workflow reference is pinned to the main branch via @main', () => {
      expect(content).toMatch(/reusable-governance-gates\.yml@main/);
    });

    test('workflow reference points to the reusable-governance-gates.yml file', () => {
      expect(content).toMatch(/reusable-governance-gates\.yml/);
    });

    test('passes secrets to the reusable workflow', () => {
      expect(content).toMatch(/secrets:\s*inherit/);
    });
  });

  describe('regression: local workflow reference removed', () => {
    test('does NOT use the old local reusable workflow path', () => {
      expect(content).not.toContain('./.github/workflows/reusable-governance-gates.yml');
    });

    test('does NOT use any relative ./ workflow reference', () => {
      // The uses: field should not reference a local file path starting with ./
      expect(content).not.toMatch(/uses:\s*\.\//);
    });
  });

  describe('workflow structure integrity', () => {
    test('contains a jobs section', () => {
      expect(content).toMatch(/^jobs:/m);
    });

    test('contains an "on" trigger section', () => {
      expect(content).toMatch(/^on:/m);
    });

    test('workflow has exactly one job defined (gates)', () => {
      // Count top-level job entries by looking for lines indented by 2 spaces followed by a word and colon
      const jobMatches = content.match(/^  \w[\w-]*:\s*$/gm);
      expect(jobMatches).not.toBeNull();
      expect(jobMatches!.length).toBe(1);
    });
  });
});
