import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  classifiedSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  attestBalance(context: __compactRuntime.CircuitContext<PS>,
                ownerAddress_0: string,
                balance_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyAttestation(context: __compactRuntime.CircuitContext<PS>,
                    ownerAddress_0: string,
                    expectedCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type ProvableCircuits<PS> = {
  attestBalance(context: __compactRuntime.CircuitContext<PS>,
                ownerAddress_0: string,
                balance_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyAttestation(context: __compactRuntime.CircuitContext<PS>,
                    ownerAddress_0: string,
                    expectedCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  attestBalance(context: __compactRuntime.CircuitContext<PS>,
                ownerAddress_0: string,
                balance_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyAttestation(context: __compactRuntime.CircuitContext<PS>,
                    ownerAddress_0: string,
                    expectedCommitment_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type Ledger = {
  attestations: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: string): boolean;
    lookup(key_0: string): Uint8Array;
    [Symbol.iterator](): Iterator<[string, Uint8Array]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
