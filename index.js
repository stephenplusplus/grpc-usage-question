'use strict'

const googleAuth = require('google-auto-auth')
const googleProtos = require('google-proto-files')
const grpc = require('grpc')
const relative = require('path').relative

googleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform']
}).getAuthClient((err, authClient) => {
  if (err) throw err

  const proto = grpc.load({
    root: googleProtos('..'),
    file: relative(googleProtos('..'), googleProtos.iam.v1)
  }, 'proto', { binaryAsBase64: true, convertFieldsToCamelCase: true })

  const service = new proto.google.iam.v1.IAMPolicy(
    'cloudresourcemanager.googleapis.com',
    grpc.credentials.combineChannelCredentials(
      grpc.credentials.createSsl(),
      grpc.credentials.createFromGoogleCredential(authClient)
    )
  )

  service.getIamPolicy({ resource: 'projects/' + process.env.GCLOUD_PROJECT }, console.log)
})
