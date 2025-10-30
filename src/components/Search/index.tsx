import React, { useCallback, useEffect } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { debounce } from 'lodash';

import tw from '../../lib/tailwind';
import Images from '../../constant/Images';

type SearchProps = {
  query: string;
  setQuery: (text: string) => void;
  onSearch?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

const Search: React.FC<SearchProps> = ({
  query,
  setQuery,
  onSearch,
  onFocus,
  onBlur,
}) => {
  const debouncedSearch = useCallback(
  onSearch ? debounce(onSearch, 400) : () => {},
  [onSearch]
);


  useEffect(() => {
  if (!onSearch) return;

  if (query.trim().length === 0) {
    onSearch(''); // reset results if query is cleared
  } else {
    debouncedSearch(query);
  }

  return () => {
    if (debouncedSearch.cancel) debouncedSearch.cancel();
  };
}, [query]);
  
  return (
    <LinearGradient
      colors={['#F5444E', '#FF094E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={tw`rounded-md p-[1px] mb-3`} // border thickness via padding
    >
      <View style={tw`flex-row items-center px-2 bg-white rounded-md`}>
        <Image
          source={Images.search}
          style={tw`h-6 w-6`}
          resizeMode="contain"
        />
        <TextInput
          style={tw`flex-1 px-2 font-regular text-lg`}
          placeholder="Search"
          placeholderTextColor={'#989898'}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Image
              source={Images.clear}
              style={tw`h-5 w-5`}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

export default Search;
