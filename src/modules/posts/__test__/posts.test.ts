import dependencyTree from 'dependency-tree';
import path from 'path';

describe('Posts module dependency test', () => {
    it('has no outside dependencies', () => {
        const directory = path.join(__dirname, '..');
        const dependencies = dependencyTree
            .toList({
                filename: path.join(directory, 'PostFacade.ts'),
                directory: directory,
            })
            .map(x => path.relative(directory, x));
        const outsideDependencies = dependencies.filter(x => {
            const parts = x.split(path.sep)[0];
            return (
                parts[0] === '..' &&
                !parts[parts.length - 1].startsWith('utils')
            );
        });
        expect(outsideDependencies).toHaveLength(0);
    });
});
