#!/bin/bash
# disable a GCP service account key
# argument is key id
gcloud iam service-accounts keys disable $1 --iam-account=charactercreator@heroes-of-myth-and-legend.iam.gserviceaccount.com 
