import { useEthers } from '@usedapp/core'
import { useRouter } from 'next/router'
import { Section } from '../../../components/layout'
import { RevealInfo, Mint, Gallery } from '../../../components/collection'
import { Error } from '../../../components/Error'
import { useCollectionContract } from '../../../hooks/collection/useCollectionContract'
import { Loading } from '../../../components/Loading'
import { Box, Flex } from '@chakra-ui/react'

function Collection(): JSX.Element {
  const router = useRouter()
  const address = router.query.address as string

  const { error: appError } = useEthers()

  const { contract, loading, error } = useCollectionContract(address)

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} />
  }

  if (appError) {
    return null
  }

  return (
    <Flex direction="column" align="center" justify="center" minHeight="100vh">
      <Box width="full" maxWidth="container.md" px={8}>
        <Section>
          <Mint collection={contract}></Mint>
        </Section>
        <Section>
          <RevealInfo collection={contract}></RevealInfo>
        </Section>
        <Section>
          <Gallery collection={contract}></Gallery>
        </Section>
      </Box>
    </Flex>
  )
}

export default Collection
