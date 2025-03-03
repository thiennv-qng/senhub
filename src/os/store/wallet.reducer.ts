import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Lamports, SPLT, Swap } from '@senswap/sen-js'

import configs from 'os/configs'

/**
 * Interface & Utility
 */

export type State = {
  visible: boolean
  address: string
  lamports: bigint
}

const initializeWindowSenOs = async (wallet: any) => {
  const {
    sol: { node, spltAddress, splataAddress, swapAddress },
  } = configs
  window.sentre = {
    wallet: wallet,
    lamports: new Lamports(node),
    splt: new SPLT(spltAddress, splataAddress, node),
    swap: new Swap(swapAddress, spltAddress, splataAddress, node),
  }
}

const destroyWindowSenOs = async () => {
  if (window.sentre?.wallet) window.sentre.wallet.disconnect()
  await initializeWindowSenOs(null)
}

/**
 * Store constructor
 */

const NAME = 'wallet'
const initialState: State = {
  visible: false,
  address: '',
  lamports: BigInt(0),
}

/**
 * Actions
 */

export const openWallet = createAsyncThunk(`${NAME}/openWallet`, async () => {
  return { visible: true }
})

export const closeWallet = createAsyncThunk(`${NAME}/closeWallet`, async () => {
  return { visible: false }
})

export const connectWallet = createAsyncThunk(
  `${NAME}/connectWallet`,
  async (wallet: any) => {
    if (!wallet) throw new Error('Invalid wallet instance')
    await initializeWindowSenOs(wallet)
    const address = await wallet.getAddress()
    const lamports = await window.sentre.lamports.getLamports(address)
    return { address, lamports: BigInt(lamports), visible: false }
  },
)

export const updateWallet = createAsyncThunk(
  `${NAME}/updateWallet`,
  async ({ lamports }: Partial<State>) => {
    return { lamports }
  },
)

export const disconnectWallet = createAsyncThunk(
  `${NAME}/disconnectWallet`,
  async () => {
    await destroyWindowSenOs()
    window.location.reload() // Reset all redux store
  },
)

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder
      .addCase(
        openWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        closeWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        connectWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        updateWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        disconnectWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
