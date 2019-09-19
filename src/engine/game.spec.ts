import { Game } from './game';

describe('Tic Tac Toe', () => {

    it('should be created from a board as a string', () => {
        // given
        const board = '.x. .xo ...';
        // when
        const game = Game.fromString(board);
        // then
        expect(game.toString()).toBe('.x..xo...');
        expect(game.currentPlayer).toBe('Player2');
    })

    it('should update board when playing', () => {
        // given
        const board = '.x..xo...';
        const game = Game.fromString(board);
        // when
        const gameAfterPlay = game.play(0);
        // then
        expect(gameAfterPlay.toString()).toBe('ox..xo...');
    })

    it('should update current player after play', () => {
        // given
        const game = new Game();
        // when
        const gameAfterPlay = game.play(0);
        // then
        expect(gameAfterPlay.currentPlayer).toBe('Player2');
    })

    it('should crash when playing on a non empty cell', () => {
        // given
        const board = '.x..xo...';
        const game = Game.fromString(board);
        // when & then
        expect(() => game.play(1)).toThrow();
    })

    it('should be won', () => {
        // given
        const board = '.ox .ox ..x';
        const game = Game.fromString(board);
        // when & then
        expect(game.getWinner()).toBe('Player1');
    })

    it('should be possible to play on any empty cell', () => {
        // given
        const board = '.ox .ox ...';
        const game = Game.fromString(board);
        // when
        const indices = game.whereToPlay();
        // then
        expect(indices).toEqual([0, 3, 6, 7, 8]);
    })

    it('should detect a winning play', () => {
        // given
        const board = '.ox .ox ...';
        const game = Game.fromString(board);
        // when
        const plays = game.getPossibleOutcomes();
        // then
        expect(plays.find(([indices, game]) => indices === 8 && game.getWinner() === 'Player1')).toBeTruthy();
    })

});