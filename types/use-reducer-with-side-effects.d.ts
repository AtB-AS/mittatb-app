declare module 'use-reducer-with-side-effects' {
  import {Dispatch} from 'react';

  export declare type ReducerWithSideEffects<S, A> = (
    prevState: S,
    action: A,
  ) => Partial<StateWithSideEffects<S, A>> | NoUpdateSymbol;
  export declare type StateWithSideEffects<S, A> = {
    state: S;
    sideEffects: SideEffect<S, A> | Array<SideEffect<S, A>>;
  };
  export declare type SideEffect<S, A> = (
    state: S,
    dispatch: Dispatch<A>,
  ) => Promise<void> | void | CancelFunc<S>;
  export declare type CancelFunc<S> = (state: S) => void;
  export declare type NoUpdateSymbol = typeof NO_UPDATE_SYMBOL;
  export declare const NO_UPDATE_SYMBOL: unique symbol;
  export declare const Update: <S>(
    state: S,
  ) => {
    state: S;
  };
  export declare const NoUpdate: () => typeof NO_UPDATE_SYMBOL;
  export declare const UpdateWithSideEffect: <S, A>(
    state: S,
    sideEffects: SideEffect<S, A> | Array<SideEffect<S, A>>,
  ) => {
    state: S;
    sideEffects: SideEffect<S, A> | Array<SideEffect<S, A>>;
  };
  export declare const SideEffect: <S, A>(
    sideEffects: SideEffect<S, A> | Array<SideEffect<S, A>>,
  ) => {
    sideEffects: SideEffect<S, A> | Array<SideEffect<S, A>>;
  };
  export declare function executeSideEffects<S, A>({
    sideEffects,
    state,
    dispatch,
  }: {
    sideEffects: SideEffect<S, A>[];
    state: S;
    dispatch: Dispatch<A>;
  }): Promise<CancelFunc<S>[]>;
  export declare function mergeState<S, A>(
    prevState: StateWithSideEffects<S, A>,
    newState: Partial<StateWithSideEffects<S, A>> | NoUpdateSymbol,
    isUpdate: boolean,
  ): StateWithSideEffects<S, A>;
  export default function useCreateReducerWithEffect<S, A>(
    reducer: ReducerWithSideEffects<S, A>,
    initialState: S,
    init?: (state: S) => Partial<StateWithSideEffects<S, A>>,
  ): [S, Dispatch<A | NoUpdateSymbol>];
  export declare function composeReducers<S, A>(
    reducers: ReducerWithSideEffects<S, A>[],
  ): (
    state: S,
    action: A,
  ) =>
    | typeof NO_UPDATE_SYMBOL
    | {
        state: S | undefined;
        sideEffects: SideEffect<S, A>[];
      };
}
