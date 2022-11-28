import React, { useState, useEffect } from 'react'

// import { getProfile } from '../../services/profiles.ts';
import { useMfers } from '../../hooks'

import { Container } from '../../components/Shared'
import Layout from '../../components/Layout'
import ProfileCard from '../../components/ProfileCard'
import AttributesCard from '../../components/AttributesCard'
import BioSection from '../../components/BioSection'
import EditProfileModal from '../../components/EditProfileModal'

// TODO: tighten up this interface
interface ProfilePageProps {
  mferId?: any
  profile?: any
  error?: any
}

export default function ProfilePage({
  mferId,
  profile,
  error,
}: ProfilePageProps) {
  // TODO: delete when available from web3 hook
  let provider: any, account: any
  // const { provider, account } = useWeb3()
  const { getMfer, checkMferOwnership } = useMfers(provider)

  // TODO: type this as a mfer
  const [mfer, setMfer] = useState<any>()
  const [isMferOwner, setIsMferOwner] = useState<boolean>()
  const [editModalIsOpen, setEditModalIsOpen] = useState<boolean>()

  // Fetch mfer data on page load
  useEffect(() => {
    if (mferId !== undefined) {
      // TODO: type as a mfer
      getMfer(mferId).then(async (result: any) => {
        setMfer(result)
      })
    }
  }, [mferId])

  // Check if connected wallet owns mfer
  useEffect(() => {
    if (account && mferId !== undefined) {
      checkMferOwnership(mferId, account).then(result => {
        setIsMferOwner(result)
      })
    }
  }, [account, mferId])

  const onEditProfileClick = () => {
    setEditModalIsOpen(true)
  }

  const onEditModalClose = () => {
    setEditModalIsOpen(false)
  }

  if (error || isNaN(mferId))
    return <h1>server error - check backend console</h1>
  if (!mfer) return <div>fetching mfer...</div>

  return (
    <Layout title={`${mfer.name} | mferspace`}>
      <Container style={{ marginTop: '1rem' }}>
        {isMferOwner && (
          <button
            onClick={onEditProfileClick}
            disabled={editModalIsOpen}
            style={{ marginBottom: '0.5rem' }}>
            edit profile
          </button>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '1rem' }}>
          <div style={{ marginRight: '4rem' }}>
            <ProfileCard mfer={mfer} profile={profile} />
            <AttributesCard attributes={mfer.attributes} />
          </div>
          <BioSection
            name={mfer.name}
            bioOne={profile.bio_1}
            bioTwo={profile.bio_2}
          />

          {editModalIsOpen && (
            <EditProfileModal
              mferId={mferId}
              profile={profile}
              onClose={onEditModalClose}
            />
          )}
        </div>
      </Container>
    </Layout>
  )
}

export const getServerSideProps = async ({ query: { id } }: any) => {
  try {
    // Validate mfer id (mfer ids can range from 0 to 10020)
    const mferId = parseInt(id)

    if (isNaN(mferId) || mferId < 0 || mferId > 10020) {
      return {
        redirect: {
          permanent: false,
          destination: '/mfer/error',
        },
      }
    }

    // TODO: remove this profile placeholder and implement data fetch
    let profile = {}
    // Fetch profile data from DB
    // const profile = await getProfile(mferId)

    return { props: { mferId, profile, error: false } }
  } catch (error) {
    console.log(error)
    return { props: { error: true } }
  }
}
