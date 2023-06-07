import React, { useCallback, useState } from 'react'
import { useEthers } from '@usedapp/core'
import { Text, Heading } from '@chakra-ui/react'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Section } from '../components/layout'

import { Error } from '../components/Error'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import CreateFormValues from '../types//CreateFormValues'
import { SuccessDialog } from '../components/dialogs/SuccessDialog'
import { CreateForm } from '../components/forms/CreateForm'
import { deployNFTCollection } from '../lib/deploy'

interface DeployedContract {
  address: string
  txHash: string
  name: string
}

function CreatePage(): JSX.Element {
  const { chainId, library } = useEthers()

  const [deployedContract, setDeployedContract] = useState<
    DeployedContract | undefined
  >()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = useCallback(
    async (args: CreateFormValues) => {
      setError('')

      if (!(library instanceof JsonRpcProvider)) {
        return null
      }

      let tx: TransactionReceipt
      try {
        const contract = await deployNFTCollection(
          args,
          library?.getSigner(),
          chainId
        )
        setIsLoading(true)
        tx = await contract.deployTransaction.wait()
      } catch (ex) {
        setError(ex.reason || ex.message || 'Unsuccessful deployment')
        return
      } finally {
        setIsLoading(false)
      }
      setDeployedContract({
        address: tx.contractAddress,
        txHash: tx.transactionHash,
        name: args.name,
      })
    },
    [library, chainId]
  )

  return (
    <>
      <Heading as="h1" mb="8">
        Create Campaign
      </Heading>
      <Text fontSize="xl">Setup a campaign with the best influence's.</Text>
      <Section>
        {deployedContract && (
          <SuccessDialog
            contractAddress={deployedContract.address}
            deployTxHash={deployedContract.txHash}
            campaignName={deployedContract.name}
          />
        )}
        {!deployedContract && (
          <CreateForm onSubmit={onSubmit} isLoading={isLoading} />
        )}
        {/* @ts-expect-error */}
        {error && <Error message={error} mt="2" />}
      </Section>
    </>
  )
}

export default CreatePage