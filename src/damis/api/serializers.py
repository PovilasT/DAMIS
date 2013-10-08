from django.contrib.auth.models import User, Group
from rest_framework import serializers
from damis.models import Dataset, Algorithm, Experiment


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')

class DatasetSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Dataset
        fields = ('title', 'licence', 'description', 'author', 'created', 'file', 'file_format')

class AlgorithmSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Algorithm
        fields = ('title', 'user', 'file', 'executable_file', 'created', 'updated')

class ExperimentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Experiment
        fields = ('title', 'start', 'finish', 'user', 'status')
