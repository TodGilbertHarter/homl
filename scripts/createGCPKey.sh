#!/bin/bash
# Generate a new service key for GCP 
# Argument is the name for the new key file.
gcloud iam service-accounts keys create $1 --iam-account=charactercreator@heroes-of-myth-and-legend.iam.gserviceaccount.com 
