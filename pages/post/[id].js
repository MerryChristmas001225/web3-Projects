import ReactMarkdown from 'react-markdown'
import { css } from '@emotion/css'
import { ethers } from 'ethers'

import {
  contractAddress
} from '../../config'
import Blog from '../../artifacts/contracts/Blog.sol/Blog.json'

const ipfsURI = "https://ipfs.io/ipfs/"

export default function Post({ post }) {
  return (
    <div>
      {
        post && (
          <div className={container}>
            {
              post.coverImage && (
                <img
                  src={post.coverImage}
                  className={coverImageStyle}
                />
              )
            }
            <h1>{post.title}</h1>
            <div className={contentContainer}>
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>
        )
      }
    </div>
  )
}

export async function getStaticPaths() {
  const provider = new ethers.providers.JsonRpcProvider()

  const contract = new ethers.Contract(contractAddress, Blog.abi, provider)
  const data = await contract.fetchPosts()

  const paths = data.map(d => ({ params: { id: d[2][0] } }))

  return {
    paths,
    fallback: true
  };
}

export async function getStaticProps({ params }) {
  const { id } = params
  const ipfsUrl = `${ipfsURI}/${id}`
  const response = await fetch(ipfsUrl)
  const data = await response.json()
  if(data.coverImage) {
    let coverImage = `${ipfsURI}/${data.coverImage}`
    data.coverImage = coverImage
  }

  return {
    props: {
      post: data
    },
  }
}

const coverImageStyle = css`
  width: 900px;
`

const container = css`
  width: 900px;
  margin: 0 auto;
`

const contentContainer = css`
  margin-top: 60px;
  padding: 0px 40px;
  border-left: 1px solid #e7e7e7;
  border-right: 1px solid #e7e7e7;
  & img {
    max-width: 900px;
  }
`