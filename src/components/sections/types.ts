import {BaseSectionItemProps} from './use-section-item';

export type ContainerSizingType = 'inline' | 'compact' | 'block' | 'spacious';
export type RadiusModeType = 'top' | 'bottom' | 'top-bottom';
export type SectionItemProps<T> = T & BaseSectionItemProps;
