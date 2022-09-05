interface IEnvironment {
    port: number;
    secretKey: string;
    applyEncryption: boolean;
    getCurrentEnvironment(): string;
    setEnvironment(env: string): void;
    isProductionEnvironment(): boolean;
    isDevEnvironment(): boolean;
    isTestEnvironment(): boolean;
}

export default IEnvironment;
