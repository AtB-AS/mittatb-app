import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {AddEditParams} from './AddForm';

export type AddEditFavoriteRootParams = {
  SearchLocation: undefined;
  AddEditForm: AddEditParams;
};

export type AddEditFavoriteStackRootProps =
  RootStackScreenProps<'AddEditFavorite'>;

export type AddEditFavoriteScreenProps<
  T extends keyof AddEditFavoriteRootParams,
> = CompositeScreenProps<
  StackScreenProps<AddEditFavoriteRootParams, T>,
  AddEditFavoriteStackRootProps
>;
