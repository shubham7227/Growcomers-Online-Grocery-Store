module.exports = {
  contracts_directory: "./blockchain/contracts",
  contracts_build_directory: "./blockchain/build",
  migrations_directory: "./blockchain/migrations",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "0.8.4",
    },
  },
  db: {
    enabled: false,
  },
};
